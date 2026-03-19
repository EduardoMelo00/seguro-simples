"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLACEHOLDERS = [
  "Quero trocar meu plano AMIL...",
  "Qual o melhor plano para minha familia?",
  "Preciso de quarto privativo...",
  "Plano com reembolso, quanto custa?",
];

const CHIPS = [
  { label: "Comparar planos", intent: "comparar" },
  { label: "Trocar de operadora", intent: "trocar" },
  { label: "Primeiro plano", intent: "primeiro" },
  { label: "Plano empresarial", intent: "empresarial" },
];

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const router = useRouter();

  useState(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/conversar?q=${encodeURIComponent(query)}`);
  }

  function handleChip(intent: string) {
    router.push(`/conversar?intent=${intent}`);
  }

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Encontre o plano de saude{" "}
            <span className="text-blue-600">ideal</span> em minutos
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Nossa IA compara planos, explica coberturas e encontra o melhor
            custo-beneficio para voce. Sem ligacoes, sem burocracia.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-xl mx-auto mb-8"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-14 rounded-2xl border border-border bg-card text-foreground shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-base"
              aria-label="Descreva o que voce precisa"
            />
            <AnimatePresence mode="wait">
              {!query && (
                <motion.span
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.5, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-12 text-muted-foreground pointer-events-none text-base"
                >
                  {PLACEHOLDERS[placeholderIndex]}
                </motion.span>
              )}
            </AnimatePresence>
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 rounded-xl bg-blue-600 hover:bg-blue-700 h-10 w-10"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {CHIPS.map((chip) => (
            <button
              key={chip.intent}
              onClick={() => handleChip(chip.intent)}
              className="px-4 py-2 rounded-full border border-border bg-card hover:bg-accent text-sm font-medium transition-colors hover:border-blue-300"
            >
              {chip.label}
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
