import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../../prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateBroker(email: string, password: string) {
    const broker = await this.prisma.broker.findUnique({
      where: { email },
    });

    if (!broker || !broker.active) return null;

    const valid = await bcrypt.compare(password, broker.password);
    if (!valid) return null;

    const payload = { sub: broker.id, email: broker.email };
    return {
      accessToken: this.jwt.sign(payload),
      broker: {
        id: broker.id,
        name: broker.name,
        email: broker.email,
      },
    };
  }
}
