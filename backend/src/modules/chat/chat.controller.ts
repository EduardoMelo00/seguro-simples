import { Controller, Post, Body, Res, HttpCode } from "@nestjs/common";
import { Response } from "express";
import { ChatService } from "./chat.service";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class MessageDto {
  @IsString()
  role!: string;

  @IsString()
  content!: string;
}

class ChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages!: MessageDto[];

  @IsOptional()
  @IsString()
  sessionId?: string;
}

@Controller("chat")
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Post("stream")
  @HttpCode(200)
  async stream(@Body() dto: ChatDto, @Res() res: Response) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    await this.service.streamChat(dto.messages, dto.sessionId, res);
  }
}
