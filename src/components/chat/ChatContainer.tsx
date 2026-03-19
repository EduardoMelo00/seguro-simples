"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "@/stores/chat";
import { useComparisonStore } from "@/stores/comparison";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ChipOptions } from "./ChipOptions";
import { TypingIndicator } from "./TypingIndicator";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/data/plan-types";
import { plans, getPlanBySlug } from "@/data/plans";

function resolveSlug(raw: string): string | null {
  if (getPlanBySlug(raw)) return raw;

  const normalized = raw.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const plan of plans) {
    const planNorm = plan.slug.replace(/-/g, "");
    if (normalized === planNorm) return plan.slug;

    const nameNorm = plan.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalized === nameNorm) return plan.slug;
  }

  for (const plan of plans) {
    const nameNorm = plan.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (nameNorm.includes(normalized) || normalized.includes(nameNorm)) {
      return plan.slug;
    }
  }

  return null;
}

function extractPlansFromText(content: string): string[] {
  const found: string[] = [];
  for (const plan of plans) {
    if (content.includes(plan.name) || content.includes(plan.slug)) {
      if (!found.includes(plan.slug)) found.push(plan.slug);
    }
  }
  return found.slice(0, 3);
}

function parseDirectives(content: string) {
  const chips: string[] = [];
  let comparePlans: string[] = [];

  const chipMatch = content.match(/\[CHIPS:\s*([\s\S]*?)\]/);
  if (chipMatch) {
    const raw = chipMatch[1];
    const matches = raw.match(/"([^"]+)"/g);
    if (matches) {
      matches.forEach((m) => chips.push(m.replace(/"/g, "")));
    }
  }

  const compareMatch = content.match(/\[COMPARE:\s*([\s\S]*?)\]/);
  if (compareMatch) {
    const raw = compareMatch[1];
    const matches = raw.match(/"([^"]+)"/g);
    if (matches) {
      matches.forEach((m) => {
        const slug = resolveSlug(m.replace(/"/g, ""));
        if (slug && !comparePlans.includes(slug)) comparePlans.push(slug);
      });
    }
  }

  if (comparePlans.length === 0) {
    comparePlans = extractPlansFromText(content);
  }

  return { chips, comparePlans };
}

interface Props {
  initialQuery?: string;
  initialIntent?: string;
}

export function ChatContainer({ initialQuery, initialIntent }: Props) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const {
    messages,
    isStreaming,
    chips,
    recommendedPlans,
    addMessage,
    updateLastAssistantMessage,
    setStreaming,
    setChips,
    setRecommendedPlans,
  } = useChatStore();
  const { setSelectedPlans } = useComparisonStore();

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: Date.now(),
      };
      addMessage(userMsg);

      const assistantMsg: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      addMessage(assistantMsg);
      setStreaming(true);
      setChips([]);

      const allMessages = [...useChatStore.getState().messages.slice(0, -1)];
      const apiMessages = allMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        const reader = response.body?.getReader();
        if (!reader) return;

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "token") {
                accumulated += data.content;
                updateLastAssistantMessage(accumulated);
              }
            } catch {
              continue;
            }
          }
        }

        const { chips: parsedChips, comparePlans } =
          parseDirectives(accumulated);
        if (parsedChips.length > 0) setChips(parsedChips);
        if (comparePlans.length > 0) setRecommendedPlans(comparePlans);
      } catch (error) {
        updateLastAssistantMessage(
          "Desculpe, tive um problema tecnico. Pode tentar novamente?"
        );
      } finally {
        setStreaming(false);
      }
    },
    [
      addMessage,
      updateLastAssistantMessage,
      setStreaming,
      setChips,
      setRecommendedPlans,
    ]
  );

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (messages.length > 0) return;

    const intentMessages: Record<string, string> = {
      comparar: "Quero comparar planos de saude",
      trocar: "Quero trocar de operadora",
      primeiro: "Estou procurando meu primeiro plano de saude",
      empresarial: "Preciso de um plano empresarial",
    };

    if (initialQuery) {
      sendMessage(initialQuery);
    } else if (initialIntent && intentMessages[initialIntent]) {
      sendMessage(intentMessages[initialIntent]);
    } else {
      sendMessage("Oi! Quero ajuda para escolher um plano de saude");
    }
  }, [initialQuery, initialIntent, sendMessage, messages.length]);

  function handleCompare() {
    setSelectedPlans(recommendedPlans);
    router.push(`/comparar?plans=${recommendedPlans.join(",")}`);
  }

  return (
    <div className="flex flex-col h-dvh bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <Logo />
        <ThemeToggle />
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isStreaming &&
            messages[messages.length - 1]?.content === "" && (
              <TypingIndicator />
            )}
        </div>
      </div>

      {recommendedPlans.length > 0 && !isStreaming && (
        <div className="px-4 py-3 border-t border-border bg-card">
          <div className="max-w-3xl mx-auto space-y-2">
            <div className="flex flex-wrap gap-1.5 justify-center">
              {recommendedPlans.map((slug) => {
                const plan = getPlanBySlug(slug);
                return plan ? (
                  <span key={slug} className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                    {plan.name}
                  </span>
                ) : null;
              })}
            </div>
            <Button
              onClick={handleCompare}
              className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 text-base font-medium"
            >
              Comparar {recommendedPlans.length} planos lado a lado
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      )}

      <ChipOptions
        chips={chips}
        onSelect={(chip) => sendMessage(chip)}
        disabled={isStreaming}
      />

      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </div>
  );
}
