import { create } from 'zustand';

// ── Types ────────────────────────────────────────────────────────

export interface MiniChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStructured?: boolean;
  createdAt: string;
}

interface MiniChatState {
  messages: MiniChatMessage[];

  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string, isStructured?: boolean) => void;
  clearMessages: () => void;

  loadFromLocalStorage: (userId: string) => void;
  saveToLocalStorage: (userId: string) => void;
  clearStore: (userId?: string) => void;
}

// ── Storage Helpers ──────────────────────────────────────────────

const STORAGE_KEY_PREFIX = 'mini-chat-store-';

function loadFromStorage(userId: string): MiniChatMessage[] | null {
  if (typeof window === 'undefined') return null;
  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(storageKey);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load mini-chat from localStorage:', error);
    return null;
  }
}

function saveToStorage(userId: string, messages: MiniChatMessage[]): void {
  if (typeof window === 'undefined') return;
  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save mini-chat to localStorage:', error);
  }
}

// ── Store ────────────────────────────────────────────────────────

export const useMiniChatStore = create<MiniChatState>((set, get) => ({
  messages: [],

  addUserMessage: (content) => {
    const newMessage: MiniChatMessage = {
      id: `mini-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  addAssistantMessage: (content, isStructured = false) => {
    const newMessage: MiniChatMessage = {
      id: `mini-${Date.now() + 1}`,
      role: 'assistant',
      content,
      isStructured,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  loadFromLocalStorage: (userId) => {
    const messages = loadFromStorage(userId);
    if (messages) {
      set({ messages });
    }
  },

  saveToLocalStorage: (userId) => {
    const { messages } = get();
    saveToStorage(userId, messages);
  },

  clearStore: (userId?: string) => {
    // Clear in-memory state
    set({ messages: [] });
    // Clear localStorage if userId is provided
    if (userId && typeof window !== 'undefined') {
      const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
      localStorage.removeItem(storageKey);
    }
  },
}));
