import { Module } from "@nestjs/common";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { PromptBuilderService } from "./prompt-builder.service";
import { PlansModule } from "../plans/plans.module";
import { HospitalsModule } from "../hospitals/hospitals.module";
import { ConversationsModule } from "../conversations/conversations.module";

@Module({
  imports: [PlansModule, HospitalsModule, ConversationsModule],
  controllers: [ChatController],
  providers: [ChatService, PromptBuilderService],
})
export class ChatModule {}
