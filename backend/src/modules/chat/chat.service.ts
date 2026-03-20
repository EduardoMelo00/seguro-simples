import { Injectable } from "@nestjs/common";
import { Response } from "express";
import OpenAI from "openai";
import { PromptBuilderService } from "./prompt-builder.service";
import { ConversationsService } from "../conversations/conversations.service";

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    private readonly promptBuilder: PromptBuilderService,
    private readonly conversationsService: ConversationsService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async streamChat(
    messages: Array<{ role: string; content: string }>,
    sessionId: string | undefined,
    res: Response,
  ) {
    const systemPrompt = await this.promptBuilder.buildSystemPrompt();

    const stream = await this.openai.chat.completions.create({
      model: "gpt-4o",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let accumulated = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        accumulated += content;
        res.write(
          `data: ${JSON.stringify({ type: "token", content })}\n\n`,
        );
      }
    }

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();

    if (sessionId) {
      const allMessages = [
        ...messages,
        { role: "assistant", content: accumulated },
      ];
      await this.conversationsService
        .upsert(sessionId, allMessages)
        .catch(() => {});
    }
  }
}
