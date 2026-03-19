"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useMemo } from "react";
import { plans, getPlanBySlug } from "@/data/plans";
import { AGE_BANDS, DEFAULT_AGE_BAND } from "@/data/age-bands";
import { AgeBand, PersonType, Plan } from "@/data/plan-types";
import { PlanGrid } from "@/components/comparison/PlanGrid";
import { ComparisonTable } from "@/components/comparison/ComparisonTable";
import { PlanDetailSheet } from "@/components/plan-detail/PlanDetailSheet";
import { Logo } from "@/components/shared/Logo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { WhatsAppCTA } from "@/components/shared/WhatsAppCTA";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutGrid, Table2 } from "lucide-react";

function scorePlan(plan: Plan, ageBand: AgeBand): number {
  let score = 50;

  const price = plan.prices.titular[ageBand];
  if (price < 500) score += 20;
  else if (price < 1000) score += 15;
  else if (price < 1500) score += 10;
  else if (price < 2000) score += 5;

  if (plan.coverage === "NAC") score += 12;
  if (plan.room === "QP") score += 10;
  if (plan.hasReimbursement) score += 8;
  if (!plan.hasCoparticipation) score += 5;

  return Math.min(score, 99);
}

function CompareContent() {
  const params = useSearchParams();
  const router = useRouter();
  const planSlugs = (params.get("plans") || "").split(",").filter(Boolean);

  const [ageBand, setAgeBand] = useState<AgeBand>(DEFAULT_AGE_BAND);
  const [personType] = useState<PersonType>("titular");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [detailPlan, setDetailPlan] = useState<Plan | null>(null);

  const selectedPlans = useMemo(() => {
    if (planSlugs.length > 0) {
      return planSlugs
        .map((slug) => getPlanBySlug(slug))
        .filter((p): p is Plan => p !== undefined);
    }
    return plans.slice(0, 3);
  }, [planSlugs]);

  const plansWithScores = useMemo(() => {
    return selectedPlans
      .map((plan) => ({ plan, score: scorePlan(plan, ageBand) }))
      .sort((a, b) => b.score - a.score);
  }, [selectedPlans, ageBand]);

  return (
    <div className="min-h-dvh bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Logo />
        </div>
        <ThemeToggle />
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Comparacao de Planos
          </h1>
          <p className="text-muted-foreground">
            {selectedPlans.length} planos selecionados pela Clara com base no
            seu perfil
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Faixa etaria:</span>
            <select
              value={ageBand}
              onChange={(e) => setAgeBand(e.target.value as AgeBand)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
            >
              {AGE_BANDS.map((band) => (
                <option key={band.value} value={band.value}>
                  {band.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <Table2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {viewMode === "cards" ? (
          <PlanGrid
            plans={plansWithScores}
            ageBand={ageBand}
            personType={personType}
            onViewDetails={(slug) =>
              setDetailPlan(getPlanBySlug(slug) || null)
            }
          />
        ) : (
          <ComparisonTable
            plans={selectedPlans}
            ageBand={ageBand}
            personType={personType}
          />
        )}
      </div>

      <PlanDetailSheet
        plan={detailPlan}
        open={!!detailPlan}
        onClose={() => setDetailPlan(null)}
      />
      <WhatsAppCTA />
    </div>
  );
}

export default function CompararPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-dvh">Carregando...</div>}>
      <CompareContent />
    </Suspense>
  );
}
