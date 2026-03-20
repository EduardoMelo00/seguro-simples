import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class OperatorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.operator.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
    });
  }
}
