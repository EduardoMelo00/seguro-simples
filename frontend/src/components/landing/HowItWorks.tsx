"use client";

import { motion } from "framer-motion";
import { MessageSquare, BarChart3, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquare,
    step: "1",
    title: "Converse",
    description: "Conte para a Clara o que voce precisa. Ela vai entender seu perfil em poucas perguntas.",
  },
  {
    icon: BarChart3,
    step: "2",
    title: "Compare",
    description: "Veja os 3 melhores planos lado a lado, com precos e coberturas detalhadas.",
  },
  {
    icon: CheckCircle2,
    step: "3",
    title: "Contrate",
    description: "Fale com um corretor parceiro pelo WhatsApp e finalize com confianca.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Como funciona</h2>
        <p className="text-center text-muted-foreground mb-12">
          3 passos simples para encontrar seu plano ideal
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative bg-card rounded-2xl p-8 border border-border"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {step.step}
              </div>
              <div className="mt-2 mb-4">
                <step.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
