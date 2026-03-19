"use client";

import { motion } from "framer-motion";
import { PhoneOff, Scale, PiggyBank } from "lucide-react";

const PROPS = [
  {
    icon: PhoneOff,
    title: "Sem ligacoes indesejadas",
    description:
      "Ninguem vai te ligar 50 vezes. Voce conversa com a IA no seu tempo.",
  },
  {
    icon: Scale,
    title: "Comparacao imparcial",
    description:
      "Sem comissao enviesando a recomendacao. A IA analisa dados puros.",
  },
  {
    icon: PiggyBank,
    title: "Economia media de R$180/mes",
    description:
      "Usuarios encontram planos com mesma cobertura por precos menores.",
  },
];

export function ValueProps() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Por que usar a SeguroSimples?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {PROPS.map((prop, i) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <prop.icon className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{prop.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {prop.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
