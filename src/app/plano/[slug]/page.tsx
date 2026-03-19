"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { getPlanBySlug, formatCurrency } from "@/data/plans";
import { AGE_BANDS, DEFAULT_AGE_BAND } from "@/data/age-bands";
import { AgeBand, PersonType } from "@/data/plan-types";
import { PlanBadges } from "@/components/comparison/PlanBadges";
import { PriceTable } from "@/components/plan-detail/PriceTable";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { WhatsAppCTA } from "@/components/shared/WhatsAppCTA";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, Check, X, MessageCircle } from "lucide-react";

const PERSON_TYPES: { label: string; value: PersonType }[] = [
  { label: "Titular", value: "titular" },
  { label: "Dependente", value: "dependente" },
  { label: "Agregado", value: "agregado" },
  { label: "Aposentado", value: "aposentado" },
];

export default function PlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const plan = getPlanBySlug(params.slug as string);
  const [personType, setPersonType] = useState<PersonType>("titular");
  const [ageBand, setAgeBand] = useState<AgeBand>(DEFAULT_AGE_BAND);

  if (!plan) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Plano nao encontrado</h1>
          <Button onClick={() => router.push("/")}>Voltar ao inicio</Button>
        </div>
      </div>
    );
  }

  const price = plan.prices[personType][ageBand];

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Logo />
        </div>
        <ThemeToggle />
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{plan.name}</h1>
            <p className="text-sm text-muted-foreground mb-3">
              ANS {plan.registroANS} | {plan.segmentation}
            </p>
            <PlanBadges plan={plan} />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 mb-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">
                Mensalidade para {PERSON_TYPES.find((p) => p.value === personType)?.label}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">R$</span>
                <span className="text-4xl font-bold">
                  {price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {PERSON_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setPersonType(pt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    personType === pt.value
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Faixa etaria:</span>
            <select
              value={ageBand}
              onChange={(e) => setAgeBand(e.target.value as AgeBand)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
            >
              {AGE_BANDS.map((band) => (
                <option key={band.value} value={band.value}>
                  {band.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs defaultValue="resumo">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="resumo" className="flex-1">Resumo</TabsTrigger>
            <TabsTrigger value="precos" className="flex-1">Tabela de Precos</TabsTrigger>
            <TabsTrigger value="cobertura" className="flex-1">Cobertura</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-3">Destaques</h3>
              <ul className="space-y-2">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-3">Limitacoes</h3>
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

          <TabsContent value="precos">
            <div className="bg-card rounded-2xl border border-border p-6">
              <PriceTable plan={plan} personType={personType} />
            </div>
          </TabsContent>

          <TabsContent value="cobertura">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="text-muted-foreground text-xs mb-1">Segmentacao</p>
                  <p className="font-medium text-sm">{plan.segmentation}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="text-muted-foreground text-xs mb-1">Acomodacao</p>
                  <p className="font-medium text-sm">
                    {plan.room === "QP" ? "Quarto Privativo" : "Quarto Coletivo"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="text-muted-foreground text-xs mb-1">Abrangencia</p>
                  <p className="font-medium text-sm">
                    {plan.coverage === "NAC" ? "Nacional" : "Regional (Parana)"}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="text-muted-foreground text-xs mb-1">Reembolso</p>
                  <p className="font-medium text-sm">
                    {plan.hasReimbursement
                      ? `Sim - Nivel ${plan.reimbursementLevel}`
                      : "Nao disponivel"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <Button
            className="w-full bg-green-500 hover:bg-green-600 rounded-xl h-12 text-base"
            onClick={() =>
              window.open(
                "https://wa.me/5541999999999?text=Quero saber mais sobre o plano " +
                  plan.name,
                "_blank"
              )
            }
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Falar com corretor sobre este plano
          </Button>
        </div>
      </div>

      <WhatsAppCTA />
    </div>
  );
}
