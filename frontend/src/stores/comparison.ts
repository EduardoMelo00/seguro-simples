import { create } from "zustand";
import { AgeBand, PersonType } from "@/data/plan-types";
import { DEFAULT_AGE_BAND } from "@/data/age-bands";

interface ComparisonState {
  selectedPlans: string[];
  selectedAgeBand: AgeBand;
  selectedPersonType: PersonType;
  setSelectedPlans: (plans: string[]) => void;
  setSelectedAgeBand: (band: AgeBand) => void;
  setSelectedPersonType: (type: PersonType) => void;
}

export const useComparisonStore = create<ComparisonState>((set) => ({
  selectedPlans: [],
  selectedAgeBand: DEFAULT_AGE_BAND,
  selectedPersonType: "titular",

  setSelectedPlans: (plans) => set({ selectedPlans: plans }),
  setSelectedAgeBand: (band) => set({ selectedAgeBand: band }),
  setSelectedPersonType: (type) => set({ selectedPersonType: type }),
}));
