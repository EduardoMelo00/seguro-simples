"use client";

import { Plan, PersonType } from "@/data/plan-types";
import { AGE_BANDS } from "@/data/age-bands";
import { formatCurrency } from "@/data/plans";

interface Props {
  plan: Plan;
  personType: PersonType;
}

export function PriceTable({ plan, personType }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="py-2 px-3 text-left font-medium text-muted-foreground">
              Faixa etaria
            </th>
            <th className="py-2 px-3 text-right font-medium text-muted-foreground">
              Mensalidade
            </th>
          </tr>
        </thead>
        <tbody>
          {AGE_BANDS.map((band) => (
            <tr
              key={band.value}
              className="border-b border-border/50 hover:bg-muted/30"
            >
              <td className="py-2 px-3">{band.label}</td>
              <td className="py-2 px-3 text-right font-medium">
                {formatCurrency(plan.prices[personType][band.value])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
