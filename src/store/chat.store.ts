import { create } from 'zustand';
import {
  ConversationService,
  type Conversation,
  type Message,
} from '@/services/conversation.service';

// ── Store Types ────────────────────────────────────────────────────

interface ChatState {
  conversations: Conversation[];
  allMessages: Message[]; // ALL messages across ALL conversations
  activeConversationId: string | null;
  syncStatus: 'idle' | 'syncing' | 'error';

  // Getters
  getActiveMessages: () => Message[];
  getMessagesByConversation: (conversationId: string) => Message[];

  // Actions
  createConversation: (type: 'ASSISTANT' | 'MINI') => Promise<string | null>;
  setActiveConversation: (id: string | null) => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  addUserMessage: (content: string) => Promise<void>;
  addAssistantMessage: (content: string, isStructured?: boolean) => Promise<void>;
  clearChat: () => Promise<void>; // Clear active conversation
  syncFromBackend: () => Promise<void>;
  loadFromLocalStorage: (userId: string) => void;
  saveToLocalStorage: (userId: string) => void;
  clearStore: () => void; // Clear entire store (for logout)
}

// ── Storage Helpers ────────────────────────────────────────────────

const STORAGE_KEY_PREFIX = 'chat-store-';

interface StorageData {
  conversations: Conversation[];
  allMessages: Message[];
  activeConversationId: string | null;
}

function loadFromStorage(userId: string): StorageData | null {
  if (typeof window === 'undefined') return null;
  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
  const stored = localStorage.getItem(storageKey);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load chat from localStorage:', error);
    return null;
  }
}

function saveToStorage(userId: string, data: StorageData): void {
  if (typeof window === 'undefined') return;
  const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save chat to localStorage:', error);
  }
}

// ── Merge Helpers ──────────────────────────────────────────────────

function mergeMessages(local: Message[] | undefined, backend: Message[] | undefined): Message[] {
  const messageMap = new Map<string, Message>();

  // Local messages first
  if (local) {
    local.forEach((m) => messageMap.set(m.id, m));
  }

  // Backend messages override/merge (backend is source of truth)
  if (backend) {
    backend.forEach((m) => {
      const existing = messageMap.get(m.id);
      if (existing) {
        messageMap.set(m.id, { ...existing, ...m, syncStatus: 'synced' });
      } else {
        messageMap.set(m.id, { ...m, syncStatus: 'synced' });
      }
    });
  }

  return Array.from(messageMap.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
}

function mergeConversations(
  local: Conversation[] | undefined,
  backend: Conversation[] | undefined,
): Conversation[] {
  const conversationMap = new Map<string, Conversation>();

  // Keep non-temp local conversations
  if (local) {
    local.forEach((c) => {
      if (!c.id.startsWith('temp-')) {
        conversationMap.set(c.id, c);
      }
    });
  }

  // Backend overrides
  if (backend) {
    backend.forEach((c) => conversationMap.set(c.id, c));
  }

  return Array.from(conversationMap.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

// ── Store ──────────────────────────────────────────────────────────

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  allMessages: [],
  activeConversationId: null,
  syncStatus: 'idle',

  getActiveMessages: () => {
    const { allMessages, activeConversationId } = get();
    if (!activeConversationId) return [];
    return allMessages.filter((m) => m.conversationId === activeConversationId);
  },

  getMessagesByConversation: (conversationId: string) => {
    return get().allMessages.filter((m) => m.conversationId === conversationId);
  },

  createConversation: async (type) => {
    const tempId = `temp-${Date.now()}`;
    const newConversation: Conversation = {
      id: tempId,
      title: 'New Chat',
      type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: tempId,
    }));

    const backendConversation = await ConversationService.createConversation(type);
    if (backendConversation) {
      set((state) => ({
        conversations: state.conversations.map((c) => (c.id === tempId ? backendConversation : c)),
        activeConversationId: backendConversation.id,
      }));
      return backendConversation.id;
    }

    return tempId;
  },

  setActiveConversation: async (id) => {
    if (!id) {
      set({ activeConversationId: null });
      return;
    }

    set({ activeConversationId: id });

    // Fetch messages from backend for this conversation
    const result = await ConversationService.getConversation(id);
    if (result) {
      set((state) => {
        const existingForThisConv = state.allMessages.filter((m) => m.conversationId !== id);
        const merged = mergeMessages(
          state.allMessages.filter((m) => m.conversationId === id),
          result.messages,
        );
        return {
          allMessages: [...existingForThisConv, ...merged],
        };
      });
    }
  },

  renameConversation: async (id, title) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c,
      ),
    }));

    await ConversationService.updateConversation(id, { title });
  },

  deleteConversation: async (id) => {
    const { conversations, activeConversationId } = get();
    const filtered = conversations.filter((c) => c.id !== id);

    set({
      conversations: filtered,
      allMessages: get().allMessages.filter((m) => m.conversationId !== id),
      activeConversationId:
        activeConversationId === id
          ? filtered.length > 0
            ? filtered[0].id
            : null
          : activeConversationId,
    });

    await ConversationService.deleteConversation(id);
  },

  addUserMessage: async (content) => {
    const { activeConversationId, allMessages, conversations } = get();

    if (!activeConversationId) {
      console.error('No active conversation');
      return;
    }

    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    // Auto-generate title from first user message
    const conversation = conversations.find((c) => c.id === activeConversationId);
    const messagesForConv = allMessages.filter(
      (m) => m.conversationId === activeConversationId && m.role === 'user',
    );
    const isFirstMessage = messagesForConv.length === 0;

    if (isFirstMessage && conversation && conversation.title === 'New Chat') {
      const words = content.split(' ');
      const title = words.slice(0, 6).join(' ') + (words.length > 6 ? '...' : '');
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === activeConversationId ? { ...c, title, updatedAt: new Date().toISOString() } : c,
        ),
      }));
      // Also sync title to backend (fire and forget)
      ConversationService.updateConversation(activeConversationId, { title });
    }

    set((state) => ({
      allMessages: [...state.allMessages, newMessage],
    }));

    // Sync to backend
    const backendMessage = await ConversationService.addMessage(activeConversationId, {
      role: 'user',
      content,
    });

    if (backendMessage) {
      set((state) => ({
        allMessages: state.allMessages.map((m) =>
          m.id === newMessage.id ? { ...m, ...backendMessage, syncStatus: 'synced' as const } : m,
        ),
      }));
    } else {
      set((state) => ({
        allMessages: state.allMessages.map((m) =>
          m.id === newMessage.id ? { ...m, syncStatus: 'error' as const } : m,
        ),
      }));
    }
  },

  addAssistantMessage: async (content, isStructured = false) => {
    const { activeConversationId } = get();

    if (!activeConversationId) {
      console.error('No active conversation');
      return;
    }

    const newMessage: Message = {
      id: `temp-${Date.now() + 1}`,
      conversationId: activeConversationId,
      role: 'assistant',
      content,
      isStructured,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
    };

    set((state) => ({
      allMessages: [...state.allMessages, newMessage],
    }));

    // Sync to backend
    const backendMessage = await ConversationService.addMessage(activeConversationId, {
      role: 'assistant',
      content,
      isStructured,
    });

    if (backendMessage) {
      set((state) => ({
        allMessages: state.allMessages.map((m) =>
          m.id === newMessage.id ? { ...m, ...backendMessage, syncStatus: 'synced' as const } : m,
        ),
      }));
    } else {
      set((state) => ({
        allMessages: state.allMessages.map((m) =>
          m.id === newMessage.id ? { ...m, syncStatus: 'error' as const } : m,
        ),
      }));
    }
  },

  clearChat: async () => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    // Delete from backend
    await ConversationService.deleteConversation(activeConversationId);

    // Clear from local state
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== activeConversationId),
      allMessages: state.allMessages.filter((m) => m.conversationId !== activeConversationId),
      activeConversationId: null,
    }));
  },

  syncFromBackend: async () => {
    set({ syncStatus: 'syncing' });

    try {
      const backendConversations = await ConversationService.listConversations();
      const localConversations = get().conversations;

      const mergedConversations = mergeConversations(localConversations, backendConversations);

      // Fetch messages for all backend conversations
      const allBackendMessages: Message[] = [];
      for (const conv of backendConversations) {
        const result = await ConversationService.getConversation(conv.id);
        if (result) {
          allBackendMessages.push(...result.messages);
        }
      }

      const localMessages = get().allMessages;
      const mergedMessages = mergeMessages(localMessages, allBackendMessages);

      set({
        conversations: mergedConversations,
        allMessages: mergedMessages,
        syncStatus: 'idle',
      });
    } catch (error) {
      console.error('Failed to sync from backend:', error);
      set({ syncStatus: 'error' });
    }
  },

  loadFromLocalStorage: (userId) => {
    const data = loadFromStorage(userId);
    if (data) {
      set({
        conversations: data.conversations ?? [],
        allMessages: data.allMessages ?? [],
        activeConversationId: data.activeConversationId ?? null,
      });
    }
  },

  saveToLocalStorage: (userId) => {
    const { conversations, allMessages, activeConversationId } = get();
    saveToStorage(userId, {
      conversations,
      allMessages,
      activeConversationId,
    });
  },

  clearStore: () => {
    set({
      conversations: [],
      allMessages: [],
      activeConversationId: null,
      syncStatus: 'idle',
    });
  },
}));
