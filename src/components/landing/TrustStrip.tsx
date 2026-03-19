"use client";

import { motion } from "framer-motion";

const OPERATORS = [
  "Amil",
  "Unimed",
  "Bradesco Saude",
  "SulAmerica",
  "NotreDame Intermedica",
];

export function TrustStrip() {
  return (
    <section className="py-12 border-y border-border/50">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Comparamos planos das principais operadoras
        </p>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
        >
          {OPERATORS.map((name) => (
            <span
              key={name}
              className="text-lg font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
