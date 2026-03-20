import { create } from "zustand";
import { ChatMessage, UserProfile } from "@/data/plan-types";

function getSessionId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  let id = localStorage.getItem("ss_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("ss_session_id", id);
  }
  return id;
}

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  chips: string[];
  recommendedPlans: string[];
  userProfile: UserProfile;
  sessionId: string;
  leadCaptured: boolean;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  setChips: (chips: string[]) => void;
  setRecommendedPlans: (plans: string[]) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  setLeadCaptured: (captured: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  chips: [],
  recommendedPlans: [],
  userProfile: {},
  sessionId: getSessionId(),
  leadCaptured: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastAssistantMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      const lastAssistant = messages.findLast((m) => m.role === "assistant");
      if (lastAssistant) {
        lastAssistant.content = content;
      }
      return { messages };
    }),

  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setChips: (chips) => set({ chips }),
  setRecommendedPlans: (plans) => set({ recommendedPlans: plans }),

  updateUserProfile: (profile) =>
    set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

  setLeadCaptured: (captured) => set({ leadCaptured: captured }),

  clearChat: () =>
    set({
      messages: [],
      chips: [],
      recommendedPlans: [],
      isStreaming: false,
      leadCaptured: false,
    }),
}));
