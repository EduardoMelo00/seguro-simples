export interface AgeBandPrice {
  "0-18": number;
  "19-23": number;
  "24-28": number;
  "29-33": number;
  "34-38": number;
  "39-43": number;
  "44-48": number;
  "49-53": number;
  "54-58": number;
  "59+": number;
}

export type AgeBand = keyof AgeBandPrice;

export type PersonType = "titular" | "dependente" | "agregado" | "aposentado";

export interface Plan {
  slug: string;
  name: string;
  registroANS: string;
  tier: string;
  room: "QP" | "QC";
  coverage: "NAC" | "REG";
  hasReimbursement: boolean;
  reimbursementLevel?: string;
  hasCoparticipation: boolean;
  segmentation: string;
  prices: Record<PersonType, AgeBandPrice>;
  highlights: string[];
  limitations: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  chips?: string[];
  comparePlans?: string[];
  timestamp: number;
}

export interface UserProfile {
  currentPlan?: string;
  currentOperator?: string;
  painPoints?: string[];
  budget?: number;
  ageBand?: AgeBand;
  priority?: string;
}
