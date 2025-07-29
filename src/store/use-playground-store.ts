// src/store/use-playground-store.ts
import { create } from 'zustand';
import { Session } from '@prisma/client';

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
  session: null,
  chatHistory: [],
  jsxCode: '',
  cssCode: '',

  // Initialize the store with data from the database
  setInitialState: (session) =>
    set({
      session,
      chatHistory: (session.chatHistory as unknown as ChatMessage[]) || [],
      jsxCode: session.jsxCode || '',
      cssCode: session.cssCode || '',
    }),

  // Add a message to the chat history
  addMessage: (message) =>
    set((state) => ({
      chatHistory: [...state.chatHistory, message],
    })),

  // Update the JSX and CSS code
  updateCode: (jsx, css) => set({ jsxCode: jsx, cssCode: css }),
}));
