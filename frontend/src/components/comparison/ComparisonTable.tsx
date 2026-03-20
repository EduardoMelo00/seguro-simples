"use client";

import { Plan, AgeBand, PersonType } from "@/data/plan-types";
import { formatCurrency } from "@/data/plans";
import { Badge } from "@/components/ui/badge";

interface Props {
  plans: Plan[];
  ageBand: AgeBand;
  personType: PersonType;
}

const ROWS: { label: string; getValue: (plan: Plan, ageBand: AgeBand, personType: PersonType) => string }[] = [
  {
    label: "Preco mensal",
    getValue: (p, ab, pt) => formatCurrency(p.prices[pt][ab]),
  },
  {
    label: "Tier",
    getValue: (p) => p.tier,
  },
  {
    label: "Quarto",
    getValue: (p) => (p.room === "QP" ? "Privativo" : "Coletivo"),
  },
  {
    label: "Cobertura",
    getValue: (p) => (p.coverage === "NAC" ? "Nacional" : "Regional"),
  },
  {
    label: "Coparticipacao",
    getValue: (p) => (p.hasCoparticipation ? "Sim" : "Nao"),
  },
  {
    label: "Reembolso",
    getValue: (p) => (p.hasReimbursement ? `Sim (${p.reimbursementLevel})` : "Nao"),
  },
];

export function ComparisonTable({ plans, ageBand, personType }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="py-3 px-4 text-left text-sm font-medium text-muted-foreground w-40" />
            {plans.map((p) => (
              <th key={p.slug} className="py-3 px-4 text-left">
                <span className="font-semibold text-sm">{p.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className="border-b border-border/50">
              <td className="py-3 px-4 text-sm text-muted-foreground font-medium">
                {row.label}
              </td>
              {plans.map((plan) => (
                <td key={plan.slug} className="py-3 px-4 text-sm">
                  {row.getValue(plan, ageBand, personType)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
