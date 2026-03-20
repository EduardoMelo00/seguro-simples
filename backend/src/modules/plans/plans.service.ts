import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

interface PlanFilters {
  operator?: string;
  tier?: string;
  coverage?: string;
  room?: string;
}

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: PlanFilters) {
    const where: Record<string, unknown> = { active: true };

    if (filters.operator) {
      where.operator = { slug: filters.operator };
    }
    if (filters.tier) where.tier = filters.tier;
    if (filters.coverage) where.coverage = filters.coverage;
    if (filters.room) where.room = filters.room;

    const plans = await this.prisma.plan.findMany({
      where,
      include: {
        operator: { select: { name: true, slug: true, logoUrl: true } },
        prices: true,
      },
      orderBy: { name: "asc" },
    });

    return plans.map((plan) => this.formatPlan(plan));
  }

  async findBySlug(slug: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { slug },
      include: {
        operator: { select: { name: true, slug: true, logoUrl: true } },
        prices: true,
      },
    });

    if (!plan) throw new NotFoundException("Plano nao encontrado");

    return this.formatPlan(plan);
  }

  async findBySlugs(slugs: string[]) {
    const plans = await this.prisma.plan.findMany({
      where: { slug: { in: slugs } },
      include: {
        operator: { select: { name: true, slug: true } },
        prices: true,
      },
    });
    return plans.map((plan) => this.formatPlan(plan));
  }

  async getAllForPrompt(city?: string, maxBudget?: number) {
    const plans = await this.prisma.plan.findMany({
      where: { active: true },
      include: {
        operator: { select: { name: true, slug: true } },
        prices: true,
      },
      orderBy: { name: "asc" },
    });

    let formatted = plans.map((plan) => this.formatPlan(plan));

    if (maxBudget) {
      formatted = formatted.filter((plan) => {
        const minPrice = Math.min(
          ...Object.values(plan.prices.titular).map(Number),
        );
        return minPrice <= maxBudget * 1.3;
      });
    }

    return formatted;
  }

  private formatPlan(plan: {
    id: string;
    slug: string;
    name: string;
    registroANS: string;
    tier: string;
    room: string;
    coverage: string;
    hasReimbursement: boolean;
    reimbursementLevel: string | null;
    hasCoparticipation: boolean;
    segmentation: string;
    highlights: string[];
    limitations: string[];
    operator: { name: string; slug: string; logoUrl?: string | null };
    prices: Array<{
      personType: string;
      ageBand: string;
      price: number;
    }>;
  }) {
    const prices: Record<string, Record<string, number>> = {};

    for (const p of plan.prices) {
      if (!prices[p.personType]) prices[p.personType] = {};
      prices[p.personType][p.ageBand] = p.price;
    }

    return {
      slug: plan.slug,
      name: plan.name,
      registroANS: plan.registroANS,
      tier: plan.tier,
      room: plan.room,
      coverage: plan.coverage,
      hasReimbursement: plan.hasReimbursement,
      reimbursementLevel: plan.reimbursementLevel,
      hasCoparticipation: plan.hasCoparticipation,
      segmentation: plan.segmentation,
      highlights: plan.highlights,
      limitations: plan.limitations,
      operator: plan.operator,
      prices,
    };
  }
}
