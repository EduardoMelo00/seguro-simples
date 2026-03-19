"use client";

import { Plan, AgeBand, PersonType } from "@/data/plan-types";
import { PlanCard } from "./PlanCard";

interface PlanWithScore {
  plan: Plan;
  score: number;
}

interface Props {
  plans: PlanWithScore[];
  ageBand: AgeBand;
  personType: PersonType;
  onViewDetails: (slug: string) => void;
}

export function PlanGrid({ plans, ageBand, personType, onViewDetails }: Props) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((p, i) => (
        <PlanCard
          key={p.plan.slug}
          plan={p.plan}
          score={p.score}
          ageBand={ageBand}
          personType={personType}
          rank={i}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
