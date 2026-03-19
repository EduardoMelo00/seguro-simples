"use client";

import { motion } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";
import { Plan, AgeBand, PersonType } from "@/data/plan-types";
import { MatchScore } from "./MatchScore";
import { PriceDisplay } from "./PriceDisplay";
import { PlanBadges } from "./PlanBadges";
import { Button } from "@/components/ui/button";

interface Props {
  plan: Plan;
  score: number;
  ageBand: AgeBand;
  personType: PersonType;
  rank: number;
  onViewDetails: (slug: string) => void;
}

export function PlanCard({ plan, score, ageBand, personType, rank, onViewDetails }: Props) {
  const price = plan.prices[personType][ageBand];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-card rounded-2xl border p-6 ${
        rank === 0
          ? "border-blue-500 shadow-lg shadow-blue-500/10"
          : "border-border"
      }`}
    >
      {rank === 0 && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
          Melhor match
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">{plan.name}</h3>
            <p className="text-xs text-muted-foreground">
              ANS {plan.registroANS}
            </p>
          </div>
        </div>
        <MatchScore score={score} size={56} />
      </div>

      <PlanBadges plan={plan} />

      <PriceDisplay value={price} className="my-4" />

      <ul className="space-y-1.5 mb-5">
        {plan.highlights.slice(0, 4).map((h) => (
          <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            {h}
          </li>
        ))}
      </ul>

      <Button
        variant="outline"
        className="w-full rounded-xl"
        onClick={() => onViewDetails(plan.slug)}
      >
        Ver detalhes
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </motion.div>
  );
}
