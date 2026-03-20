"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ChatContainer } from "@/components/chat/ChatContainer";

function ChatPage() {
  const params = useSearchParams();
  const q = params.get("q") || undefined;
  const intent = params.get("intent") || undefined;

  return <ChatContainer initialQuery={q} initialIntent={intent} />;
}

export default function ConversarPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-dvh">Carregando...</div>}>
      <ChatPage />
    </Suspense>
  );
}
