import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

interface HospitalFilters {
  city?: string;
  operator?: string;
}

@Injectable()
export class HospitalsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: HospitalFilters) {
    const where: Record<string, unknown> = {};

    if (filters.city) {
      where.city = {
        contains: filters.city,
        mode: "insensitive",
      };
    }
    if (filters.operator) {
      where.operator = { slug: filters.operator };
    }

    return this.prisma.hospital.findMany({
      where,
      include: {
        operator: { select: { name: true, slug: true } },
      },
      orderBy: { planCount: "desc" },
    });
  }

  async getCities() {
    const cities = await this.prisma.hospital.findMany({
      select: { city: true },
      distinct: ["city"],
      orderBy: { city: "asc" },
    });
    return cities.map((c) => c.city);
  }

  async getHospitalsSummary() {
    const hospitals = await this.prisma.hospital.findMany({
      orderBy: { planCount: "desc" },
    });

    const byCity: Record<
      string,
      Array<{ name: string; emergency: boolean }>
    > = {};
    for (const h of hospitals) {
      if (!byCity[h.city]) byCity[h.city] = [];
      byCity[h.city].push({ name: h.name, emergency: h.emergency });
    }

    const lines: string[] = [];
    for (const [city, hosps] of Object.entries(byCity)) {
      const top = hosps.slice(0, 8);
      const names = top
        .map(
          (h) =>
            `${h.name}${h.emergency ? " (Urgencia/Emergencia)" : ""}`,
        )
        .join(", ");
      lines.push(
        `- ${city}: ${hosps.length} hospitais. Principais: ${names}`,
      );
    }
    return lines.join("\n");
  }
}
