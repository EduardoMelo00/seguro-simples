"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppCTA() {
  return (
    <a
      href="https://wa.me/5541999999999?text=Oi! Quero ajuda para escolher um plano de saude"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
