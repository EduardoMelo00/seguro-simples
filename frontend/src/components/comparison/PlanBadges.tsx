"use client";

import { Badge } from "@/components/ui/badge";
import { Plan } from "@/data/plan-types";

interface Props {
  plan: Plan;
}

export function PlanBadges({ plan }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {plan.coverage === "NAC" && (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0 text-xs">
          Nacional
        </Badge>
      )}
      {plan.coverage === "REG" && (
        <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-0 text-xs">
          Regional
        </Badge>
      )}
      <Badge variant="secondary" className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-0 text-xs">
        {plan.room === "QP" ? "Quarto Privativo" : "Quarto Coletivo"}
      </Badge>
      {plan.hasCoparticipation && (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0 text-xs">
          Coparticipacao
        </Badge>
      )}
      {plan.hasReimbursement && (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-xs">
          Reembolso {plan.reimbursementLevel}
        </Badge>
      )}
    </div>
  );
}
