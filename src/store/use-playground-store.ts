// src/store/use-playground-store.ts
import { create } from 'zustand';
import { Session } from '@prisma/client'; // Import the Session type from Prisma

// Define the shape of a single chat message
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Define the state and actions for our store
interface PlaygroundState {
  session: Session | null;
  chatHistory: ChatMessage[];
  jsxCode: string;
  cssCode: string;
  setInitialState: (session: Session) => void;
  addMessage: (message: ChatMessage) => void;
  updateCode: (jsx: string, css: string) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  // Initial empty state
  session: null,
  chatHistory: [],
  jsxCode: '',
  cssCode: '',

  // Action to initialize the store with data from the database
  setInitialState: (session) => {
    set({
      session,
      // Prisma stores Json as a generic type, so we need to assert its structure
      chatHistory: (session.chatHistory as ChatMessage[]) || [],
      jsxCode: session.jsxCode || '',
      cssCode: session.cssCode || '',
    });
  },

  // Action to add a new message to the chat history
  addMessage: (message) =>
    set((state) => ({ chatHistory: [...state.chatHistory, message] })),

  // Action to update the generated code
  updateCode: (jsx, css) => set({ jsxCode: jsx, cssCode: css }),
}));
