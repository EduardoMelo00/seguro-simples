"use client";

import { Logo } from "@/components/shared/Logo";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo />
        <p className="text-sm text-muted-foreground">
          Demo — Plataforma inteligente para comparacao de planos de saude
        </p>
      </div>
    </footer>
  );
}
