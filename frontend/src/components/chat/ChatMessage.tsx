"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/data/plan-types";

interface Props {
  message: ChatMessageType;
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-card border border-border"
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {formatContent(message.content)}
        </div>
      </div>
    </motion.div>
  );
}

function formatContent(content: string): string {
  return content
    .replace(/\[CHIPS:[\s\S]*?\]/g, "")
    .replace(/\[COMPARE:[\s\S]*?\]/g, "")
    .trim();
}
