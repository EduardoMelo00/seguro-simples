import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    sessionId: string,
    messages: Array<{ role: string; content: string }>,
    profile?: Record<string, unknown>,
  ) {
    const messagesJson = JSON.parse(
      JSON.stringify(messages),
    ) as Prisma.InputJsonValue;
    const profileJson = profile
      ? (JSON.parse(JSON.stringify(profile)) as Prisma.InputJsonValue)
      : Prisma.JsonNull;

    return this.prisma.conversation.upsert({
      where: { sessionId },
      create: {
        sessionId,
        messages: messagesJson,
        profile: profileJson,
      },
      update: {
        messages: messagesJson,
        ...(profile ? { profile: profileJson } : {}),
      },
    });
  }

  async findBySessionId(sessionId: string) {
    return this.prisma.conversation.findUnique({
      where: { sessionId },
    });
  }
}
