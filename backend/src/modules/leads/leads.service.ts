import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateLeadDto, UpdateLeadDto, LeadFilterDto } from "./leads.dto";
import { LeadStatus } from "@prisma/client";

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateLeadDto) {
    let conversationId: string | undefined;

    if (dto.sessionId) {
      const conversation = await this.prisma.conversation.findUnique({
        where: { sessionId: dto.sessionId },
      });
      if (conversation) conversationId = conversation.id;
    }

    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        phone: dto.phone,
        email: dto.email,
        city: dto.city,
        sessionId: dto.sessionId,
        conversationId,
      },
    });

    if (dto.recommendedPlanSlugs?.length) {
      const plans = await this.prisma.plan.findMany({
        where: { slug: { in: dto.recommendedPlanSlugs } },
        select: { id: true },
      });

      if (plans.length > 0) {
        await this.prisma.leadPlan.createMany({
          data: plans.map((p) => ({
            leadId: lead.id,
            planId: p.id,
          })),
        });
      }
    }

    const fullLead = await this.prisma.lead.findUnique({
      where: { id: lead.id },
      include: {
        leadPlans: { include: { plan: { select: { name: true, slug: true } } } },
      },
    });

    await this.notifications.notifyNewLead(fullLead!).catch(() => {});

    return fullLead;
  }

  async findAll(filters: LeadFilterDto) {
    const page = parseInt(filters.page || "1", 10);
    const limit = parseInt(filters.limit || "20", 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
    if (filters.city) {
      where.city = { contains: filters.city, mode: "insensitive" };
    }
    if (filters.from || filters.to) {
      where.createdAt = {
        ...(filters.from ? { gte: new Date(filters.from) } : {}),
        ...(filters.to ? { lte: new Date(filters.to) } : {}),
      };
    }

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: {
          leadPlans: {
            include: { plan: { select: { name: true, slug: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      data: leads,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        leadPlans: {
          include: { plan: { select: { name: true, slug: true } } },
        },
        conversation: true,
      },
    });

    if (!lead) throw new NotFoundException("Lead nao encontrado");
    return lead;
  }

  async update(id: string, dto: UpdateLeadDto) {
    await this.findById(id);
    return this.prisma.lead.update({
      where: { id },
      data: dto,
      include: {
        leadPlans: {
          include: { plan: { select: { name: true, slug: true } } },
        },
      },
    });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, newToday, byStatus] = await Promise.all([
      this.prisma.lead.count(),
      this.prisma.lead.count({
        where: { createdAt: { gte: today } },
      }),
      this.prisma.lead.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    const closed =
      byStatus.find((s) => s.status === LeadStatus.CLOSED)?._count || 0;
    const conversionRate = total > 0 ? ((closed / total) * 100).toFixed(1) : "0";

    return {
      total,
      newToday,
      byStatus: byStatus.reduce(
        (acc, s) => {
          acc[s.status] = s._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      conversionRate: `${conversionRate}%`,
    };
  }
}
