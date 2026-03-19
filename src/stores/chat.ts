import { create } from "zustand";
import { ChatMessage, UserProfile } from "@/data/plan-types";

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  chips: string[];
  recommendedPlans: string[];
  userProfile: UserProfile;
  addMessage: (message: ChatMessage) => void;
  updateLastAssistantMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  setChips: (chips: string[]) => void;
  setRecommendedPlans: (plans: string[]) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  chips: [],
  recommendedPlans: [],
  userProfile: {},

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

  clearChat: () =>
    set({
      messages: [],
      chips: [],
      recommendedPlans: [],
      isStreaming: false,
    }),
}));
