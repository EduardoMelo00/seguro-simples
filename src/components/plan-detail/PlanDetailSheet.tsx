"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plan, PersonType } from "@/data/plan-types";
import { PlanBadges } from "@/components/comparison/PlanBadges";
import { PriceTable } from "./PriceTable";
import { Shield, Check, X } from "lucide-react";
import { useState } from "react";

interface Props {
  plan: Plan | null;
  open: boolean;
  onClose: () => void;
}

const PERSON_TYPES: { label: string; value: PersonType }[] = [
  { label: "Titular", value: "titular" },
  { label: "Dependente", value: "dependente" },
  { label: "Agregado", value: "agregado" },
  { label: "Aposentado", value: "aposentado" },
];

export function PlanDetailSheet({ plan, open, onClose }: Props) {
  const [personType, setPersonType] = useState<PersonType>("titular");

  if (!plan) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <SheetTitle>{plan.name}</SheetTitle>
              <p className="text-xs text-muted-foreground">
                ANS {plan.registroANS}
              </p>
            </div>
          </div>
          <PlanBadges plan={plan} />
        </SheetHeader>

        <Tabs defaultValue="resumo" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="resumo" className="flex-1">Resumo</TabsTrigger>
            <TabsTrigger value="precos" className="flex-1">Precos</TabsTrigger>
            <TabsTrigger value="cobertura" className="flex-1">Cobertura</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="mt-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-sm">Destaques</h4>
              <ul className="space-y-2">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-sm">Limitacoes</h4>
              <ul className="space-y-2">
                {plan.limitations.map((l) => (
                  <li key={l} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="precos" className="mt-4 space-y-4">
            <div className="flex gap-2 flex-wrap">
              {PERSON_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setPersonType(pt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    personType === pt.value
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
            <PriceTable plan={plan} personType={personType} />
          </TabsContent>

          <TabsContent value="cobertura" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-muted-foreground text-xs mb-1">Segmentacao</p>
                <p className="font-medium">{plan.segmentation}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-muted-foreground text-xs mb-1">Acomodacao</p>
                <p className="font-medium">
                  {plan.room === "QP" ? "Quarto Privativo" : "Quarto Coletivo"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-muted-foreground text-xs mb-1">Abrangencia</p>
                <p className="font-medium">
                  {plan.coverage === "NAC" ? "Nacional" : "Regional"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-muted/30">
                <p className="text-muted-foreground text-xs mb-1">Reembolso</p>
                <p className="font-medium">
                  {plan.hasReimbursement
                    ? `Sim - Nivel ${plan.reimbursementLevel}`
                    : "Nao"}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
