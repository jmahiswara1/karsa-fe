

# Chat Session History Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-conversation chat history with optimistic hybrid persistence (Zustand + localStorage + backend sync) so chat messages persist across page navigation and component unmounts.

**Architecture:** Zustand store with localStorage persistence as primary read layer (instant, no loading states). Backend API as source of truth for cross-device sync. Messages appear instantly from local state, sync to backend in the background. Two independent chat contexts: full chat (`/assistant`) with conversation list sidebar, and mini chat (`/dashboard`) with single active conversation.

**Tech Stack:** Next.js 16, React 19, TypeScript, Zustand 5, Axios, TanStack React Query, Framer Motion, next-intl, Tailwind CSS

## Global Constraints

- Zustand v5 — use manual localStorage hydration (zustand/middleware persist works but we control hydration explicitly for SSR safety)
- All API calls go through `src/lib/api.ts` Axios instance (handles auth cookies + token refresh)
- Message interface must include `conversationId` field
- localStorage key format: `chat-store-{userId}` to isolate user data
- Backend endpoints not yet implemented — frontend must work with localStorage-only fallback
- Translation keys must be added to both `messages/en.json` and `messages/id.json`

## File Structure

```
src/
├── store/
│   ├── chat.store.ts (NEW) — Zustand store for conversations, messages, persistence, sync
├── services/
│   ├── conversation.service.ts (NEW) — API service for CRUD conversations & messages
├── components/
│   ├── assistant/
│   │   ├── ChatInterface.tsx (MODIFY) — Wire to Zustand store
│   │   ├── ContextSidebar.tsx (MODIFY) — Add conversation list UI
│   │   ├── MessageBubble.tsx (MODIFY) — Add sync status badge
│   ├── dashboard/
│   │   ├── MiniChat.tsx (MODIFY) — Wire to Zustand store
│   │   ├── GreetingBanner.tsx (MODIFY) — Fix collapse bug, keep mounted
├── hooks/
│   ├── use-assistant.ts (MODIFY) — Integrate store auto-save
```

---

### Task 1: Create Conversation Service

**Files:**
- Create: `src/services/conversation.service.ts`

**Interfaces:**
- Produces: `ConversationService` object with methods: `listConversations`, `getConversation`, `createConversation`, `updateConversation`, `deleteConversation`, `addMessage`

- [ ] **Step 1: Create conversation service file**

```typescript
import { api } from '@/lib/api';

export interface Conversation {
  id: string;
  title: string;
  type: 'assistant' | 'mini';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  isStructured?: boolean;
  createdAt: string;
  orderIndex: number;
}

export const ConversationService = {
  listConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await api.get<{ data: Conversation[] }>('/api/assistant/conversations');
      return response.data.data;
    } catch (error) {
      console.warn('Failed to fetch conversations from backend:', error);
      return [];
    }
  },

  getConversation: async (id: string): Promise<ConversationMessage[]> => {
    try {
      const response = await api.get<{ data: ConversationMessage[] }>(
        `/api/assistant/conversations/${id}/messages`
      );
      return response.data.data;
    } catch (error) {
      console.warn('Failed to fetch conversation messages:', error);
      return [];
    }
  },

  createConversation: async (type: 'assistant' | 'mini'): Promise<Conversation | null> => {
    try {
      const response = await api.post<{ data: Conversation }>('/api/assistant/conversations', {
        type,
      });
      return response.data.data;
    } catch (error) {
      console.warn('Failed to create conversation:', error);
      return null;
    }
  },

  updateConversation: async (
    id: string,
    updates: { title: string }
  ): Promise<Conversation | null> => {
    try {
      const response = await api.patch<{ data: Conversation }>(
        `/api/assistant/conversations/${id}`,
        updates
      );
      return response.data.data;
    } catch (error) {
      console.warn('Failed to update conversation:', error);
      return null;
    }
  },

  deleteConversation: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/assistant/conversations/${id}`);
      return true;
    } catch (error) {
      console.warn('Failed to delete conversation:', error);
      return false;
    }
  },

  addMessage: async (
    conversationId: string,
    message: { role: 'user' | 'assistant'; content: string }
  ): Promise<ConversationMessage | null> => {
    try {
      const response = await api.post<{ data: ConversationMessage }>(
        `/api/assistant/conversations/${conversationId}/messages`,
        message
      );
      return response.data.data;
    } catch (error) {
      console.warn('Failed to save message to backend:', error);
      return null;
    }
  },
};
```

- [ ] **Step 2: Verify TypeScript compilation**

Run: `cd e:\Project\Karsa\fe-karsa && npx tsc --noEmit`
Expected: No errors related to `conversation.service.ts`

- [ ] **Step 3: Commit**

```bash
git add src/services/conversation.service.ts
git commit -m "feat: add conversation service for chat history API"
```

---

### Task 2: Create Zustand Chat Store

**Files:**
- Create: `src/store/chat.store.ts`

**Interfaces:**
- Consumes: `ConversationService` from `src/services/conversation.service.ts`
- Produces: `useChatStore` hook with state and actions

- [ ] **Step 1: Create chat store file**

```typescript
import { create } from 'zustand';
import {
  ConversationService,
  type Conversation,
  type ConversationMessage,
} from '@/services/conversation.service';

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  isStructured?: boolean;
  createdAt: string;
  orderIndex: number;
  syncStatus?: 'pending' | 'synced' | 'error';
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  syncStatus: 'idle' | 'syncing' | 'error';

  // Actions
  createConversation: (type: 'assistant' | 'mini') => Promise<string | null>;
  setActiveConversation: (id: string | null) => void;
  renameConversation: (id: string, title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  addUserMessage: (content: string) => Promise<void>;
  addAssistantMessage: (content: string, isStructured?: boolean) => Promise<void>;
  syncFromBackend: () => Promise<void>;
  loadFromLocalStorage: (userId: string) => void;
  saveToLocalStorage: (userId: string) => void;
}

const STORAGE_KEY_PREFIX = 'chat-store-';

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  syncStatus: 'idle',

  createConversation: async (type) => {
    const tempId = `temp-${Date.now()}`;
    const newConversation: Conversation = {
      id: tempId,
      title: 'New Chat',
      type,
      userId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      activeConversationId: tempId,
      messages: [],
    }));

    const backendConversation = await ConversationService.createConversation(type);
    if (backendConversation) {
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === tempId ? backendConversation : c
        ),
        activeConversationId: backendConversation.id,
      }));
      return backendConversation.id;
    }

    return tempId;
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (id) {
      const conversation = get().conversations.find((c) => c.id === id);
      if (conversation) {
        ConversationService.getConversation(id).then((backendMessages) => {
          const localMessages = get().messages;
          const merged = mergeMessages(localMessages, backendMessages);
          set({ messages: merged });
        });
      }
    } else {
      set({ messages: [] });
    }
  },

  renameConversation: async (id, title) => {
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? { ...c, title } : c)),
    }));

    await ConversationService.updateConversation(id, { title });
  },

  deleteConversation: async (id) => {
    const { conversations, activeConversationId } = get();
    const filtered = conversations.filter((c) => c.id !== id);

    set({
      conversations: filtered,
      activeConversationId:
        activeConversationId === id
          ? filtered.length > 0
            ? filtered[0].id
            : null
          : activeConversationId,
      messages: activeConversationId === id ? [] : get().messages,
    });

    await ConversationService.deleteConversation(id);
  },

  addUserMessage: async (content) => {
    const { activeConversationId, messages, conversations } = get();

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
      orderIndex: messages.length,
      syncStatus: 'pending',
    };

    // Auto-generate title from first user message
    const conversation = conversations.find((c) => c.id === activeConversationId);
    const isFirstMessage = messages.filter((m) => m.role === 'user').length === 0;

    if (isFirstMessage && conversation && conversation.title === 'New Chat') {
      const title = content.split(' ').slice(0, 6).join(' ') + (content.split(' ').length > 6 ? '...' : '');
      set((state) => ({
        conversations: state.conversations.map((c) =>
          c.id === activeConversationId ? { ...c, title, updatedAt: new Date().toISOString() } : c
        ),
      }));
    }

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // Sync to backend
    const backendMessage = await ConversationService.addMessage(activeConversationId, {
      role: 'user',
      content,
    });

    if (backendMessage) {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === newMessage.id ? { ...m, ...backendMessage, syncStatus: 'synced' } : m
        ),
      }));
    } else {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === newMessage.id ? { ...m, syncStatus: 'error' } : m
        ),
      }));
    }
  },

  addAssistantMessage: async (content, isStructured = false) => {
    const { activeConversationId, messages } = get();

    if (!activeConversationId) {
      console.error('No active conversation');
      return;
    }

    const newMessage: Message = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      role: 'assistant',
      content,
      isStructured,
      createdAt: new Date().toISOString(),
      orderIndex: messages.length,
      syncStatus: 'pending',
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
    }));

    // Sync to backend
    const backendMessage = await ConversationService.addMessage(activeConversationId, {
      role: 'assistant',
      content,
    });

    if (backendMessage) {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === newMessage.id ? { ...m, ...backendMessage, syncStatus: 'synced' } : m
        ),
      }));
    } else {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === newMessage.id ? { ...m, syncStatus: 'error' } : m
        ),
      }));
    }
  },

  syncFromBackend: async () => {
    set({ syncStatus: 'syncing' });

    try {
      const backendConversations = await ConversationService.listConversations();
      const localConversations = get().conversations;

      // Merge conversations: backend is source of truth
      const merged = mergeConversations(localConversations, backendConversations);
      set({ conversations: merged, syncStatus: 'idle' });
    } catch (error) {
      console.error('Failed to sync from backend:', error);
      set({ syncStatus: 'error' });
    }
  },

  loadFromLocalStorage: (userId) => {
    if (typeof window === 'undefined') return;

    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    const stored = localStorage.getItem(storageKey);

    if (stored) {
      try {
        const data = JSON.parse(stored);
        set({
          conversations: data.conversations || [],
          activeConversationId: data.activeConversationId || null,
          messages: data.messages || [],
        });
      } catch (error) {
        console.error('Failed to load chat from localStorage:', error);
      }
    }
  },

  saveToLocalStorage: (userId) => {
    if (typeof window === 'undefined') return;

    const storageKey = `${STORAGE_KEY_PREFIX}${userId}`;
    const { conversations, activeConversationId, messages } = get();

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          conversations,
          activeConversationId,
          messages,
        })
      );
    } catch (error) {
      console.error('Failed to save chat to localStorage:', error);
    }
  },
}));

// Helper functions
function mergeMessages(local: Message[], backend: ConversationMessage[]): Message[] {
  const messageMap = new Map<string, Message>();

  local.forEach((m) => messageMap.set(m.id, m));
  backend.forEach((m) => {
    const existing = messageMap.get(m.id);
    if (existing) {
      messageMap.set(m.id, { ...existing, ...m, syncStatus: 'synced' });
    } else {
      messageMap.set(m.id, { ...m, syncStatus: 'synced' });
    }
  });

  return Array.from(messageMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);
}

function mergeConversations(local: Conversation[], backend: Conversation[]): Conversation[] {
  const conversationMap = new Map<string, Conversation>();

  local.forEach((c) => {
    if (!c.id.startsWith('temp-')) {
      conversationMap.set(c.id, c);
    }
  });
  backend.forEach((c) => conversationMap.set(c.id, c));

  return Array.from(conversationMap.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
```

- [ ] **Step 2: Add auto-save to localStorage on state changes**

Create a wrapper hook in the same file (append after the store):

```typescript
// Auto-save to localStorage on state changes
import { useEffect } from 'react';
import { useAuthStore } from './auth.store';

export function useChatPersistence() {
  const { user } = useAuthStore();
  const { saveToLocalStorage, loadFromLocalStorage, syncFromBackend } = useChatStore();

  useEffect(() => {
    if (user?.id) {
      loadFromLocalStorage(user.id);
      syncFromBackend();
    }
  }, [user?.id, loadFromLocalStorage, syncFromBackend]);

  useEffect(() => {
    if (user?.id) {
      const unsubscribe = useChatStore.subscribe((state) => {
        saveToLocalStorage(user.id);
      });
      return unsubscribe;
    }
  }, [user?.id, saveToLocalStorage]);
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd e:\Project\Karsa\fe-karsa && npx tsc --noEmit`
Expected: No errors related to `chat.store.ts`

- [ ] **Step 4: Commit**

```bash
git add src/store/chat.store.ts
git commit -m "feat: add Zustand chat store with localStorage persistence"
```

---

### Task 3: Fix Mini Chat Collapse Bug

**Files:**
- Modify: `src/components/dashboard/GreetingBanner.tsx:99-115`

**Interfaces:**
- None

- [ ] **Step 1: Replace conditional render with CSS hide**

In `src/components/dashboard/GreetingBanner.tsx`, replace lines 99-115:

```tsx
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden rounded-b-2xl shadow-lg"
            style={{
              background:
                'linear-gradient(135deg, oklch(0.64 0.19 255) 0%, oklch(0.58 0.20 265) 50%, oklch(0.54 0.18 278) 100%)',
            }}
          >
            <MiniChat userAvatar={user?.avatarUrl} />
          </motion.div>
        )}
      </AnimatePresence>
```

With:

```tsx
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden rounded-b-2xl shadow-lg"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.64 0.19 255) 0%, oklch(0.58 0.20 265) 50%, oklch(0.54 0.18 278) 100%)',
        }}
      >
        <MiniChat userAvatar={user?.avatarUrl} />
      </motion.div>
```

- [ ] **Step 2: Persist isExpanded state to localStorage**

Add to `GreetingBanner.tsx` after line 25 (`const [isExpanded, setIsExpanded] = useState(false);`):

```tsx
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('minichat-expanded') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('minichat-expanded', String(isExpanded));
    }
  }, [isExpanded]);
```

- [ ] **Step 3: Remove unused AnimatePresence import**

Change line 7:

```tsx
import { motion, AnimatePresence } from 'framer-motion';
```

To:

```tsx
import { motion } from 'framer-motion';
```

- [ ] **Step 4: Verify build**

Run: `cd e:\Project\Karsa\fe-karsa && npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/dashboard/GreetingBanner.tsx
git commit -m "fix: keep MiniChat mounted on collapse to preserve messages"
```

---

### Task 4: Wire MiniChat to Zustand Store

**Files:**
- Modify: `src/components/dashboard/MiniChat.tsx`

**Interfaces:**
- Consumes: `useChatStore` from `src/store/chat.store.ts`

- [ ] **Step 1: Replace useState with Zustand store**

In `src/components/dashboard/MiniChat.tsx`, replace the state management (lines 88-93):

```tsx
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isPending, error } = useAssistant();
```

With:

```tsx
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isPending, error } = useAssistant();

  const {
    messages,
    activeConversationId,
    createConversation,
    addUserMessage,
    addAssistantMessage,
  } = useChatStore((state) => ({
    messages: state.messages.filter((m) => m.conversationId === state.activeConversationId),
    activeConversationId: state.activeConversationId,
    createConversation: state.createConversation,
    addUserMessage: state.addUserMessage,
    addAssistantMessage: state.addAssistantMessage,
  }));

  // Create mini conversation on first load if needed
  useEffect(() => {
    if (!activeConversationId) {
      createConversation('mini');
    }
  }, [activeConversationId, createConversation]);
```

- [ ] **Step 2: Update handleSend to use store actions**

Replace the `handleSend` function (lines 105-141):

```tsx
  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendMessage(userMessage.content);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data?.reply || response.message,
        isStructured: !!response.data?.action,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error || t('quick_chat_error'),
        isStructured: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
```

With:

```tsx
  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const content = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      await addUserMessage(content);
      const response = await sendMessage(content);
      const aiContent = response.data?.reply || response.message;
      const isStructured = !!response.data?.action;
      await addAssistantMessage(aiContent, isStructured);
    } catch (err: unknown) {
      console.error(err);
      await addAssistantMessage(error || t('quick_chat_error'), false);
    } finally {
      setIsTyping(false);
    }
  };
```

- [ ] **Step 3: Remove unused imports**

Remove line 7:

```tsx
import ReactMarkdown from 'react-markdown';
```

Remove line 8:

```tsx
import remarkGfm from 'remark-gfm';
```

Remove line 11:

```tsx
import { Message } from '@/components/assistant/MessageBubble';
```

- [ ] **Step 4: Add import for useChatStore**

Add after line 10:

```tsx
import { useChatStore } from '@/store/chat.store';
```

- [ ] **Step 5: Verify build**

Run: `cd e:\Project\Karsa\fe-karsa && npm run build`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add src/components/dashboard/MiniChat.tsx
git commit -m "feat: wire MiniChat to Zustand store for persistence"
```

---

### Task 5: Integrate Store Auto-Save in useAssistant Hook

**Files:**
- Modify: `src/hooks/use-assistant.ts`

**Interfaces:**
- Produces: Enhanced `useAssistant` hook that auto-saves messages

- [ ] **Step 1: Add store integration to useAssistant**

Replace the entire content of `src/hooks/use-assistant.ts`:

```typescript
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AssistantService } from '@/services/assistant.service';
import { useChatStore } from '@/store/chat.store';

export function useAssistant() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { addUserMessage, addAssistantMessage } = useChatStore();

  const mutation = useMutation({
    mutationFn: (prompt: string) => AssistantService.chat(prompt),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      console.error('AI chat failed:', err);
      setErrorMsg(
        err.response?.data?.message ||
          'Sorry, an error occurred while contacting AI. Please try again.',
      );
    },
  });

  return {
    sendMessage: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: errorMsg,
    addUserMessage,
    addAssistantMessage,
  };
}
```

- [ ] **Step 2: Verify build**

Run: `cd e:\Project\Karsa\fe-karsa && npm run build`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-assistant.ts
git commit -m "feat: integrate chat store auto-save in useAssistant hook"
```

---

### Task 6: Wire ChatInterface to Zustand Store

**Files:**
- Modify: `src/components/assistant/ChatInterface.tsx`

**Interfaces:**
- Consumes: `useChatStore` from `src/store/chat.store.ts`

- [ ] **Step 1: Replace useState with Zustand store**

In `src/components/assistant/ChatInterface.tsx`, replace lines 17-22:

```tsx
  const [messages, setMessages] = useState('');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isPending, error } = useAssistant();
```

With:

```tsx
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isPending, error } = useAssistant();

  const {
    messages,
    activeConversationId,
    createConversation,
    addUserMessage,
    addAssistantMessage,
  } = useChatStore((state) => ({
    messages: state.messages.filter((m) => m.conversationId === state.activeConversationId),
    activeConversationId: state.activeConversationId,
    createConversation: state.createConversation,
    addUserMessage: state.addUserMessage,
    addAssistantMessage: state.addAssistantMessage,
  }));

  // Create assistant conversation on first load if needed
  useEffect(() => {
    if (!activeConversationId) {
      createConversation('assistant');
    }
  }, [activeConversationId, createConversation]);
```

- [ ] **Step 2: Update handleSend to use store actions**

Replace the `handleSend` function (lines 38-74):

```tsx
  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendMessage(userMessage.content);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data?.reply || response.message,
        isStructured: !!response.data?.action,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error || t('msg_error'),
        isStructured: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
```

With:

```tsx
  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const content = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      await addUserMessage(content);
      const response = await sendMessage(content);
      const aiContent = response.data?.reply || response.message;
      const isStructured = !!response.data?.action;
      await addAssistantMessage(aiContent, isStructured);
    } catch (err: unknown) {
      console.error(err);
      await addAssistantMessage(error || t('msg_error'), false);
    } finally {
      setIsTyping(false);
    }
  };
```

- [ ] **Step 3: Add import for useChatStore**

Add after line 8:

```tsx
import { useChatStore } from '@/store/chat.store';
```

- [ ] **Step 4: Verify build**

Run: `cd e:\Project\Karsa\fe-karsa && npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/assistant/ChatInterface.tsx
git commit -m "feat: wire ChatInterface to Zustand store for persistence"
```

---

### Task 7: Add Conversation List to ContextSidebar

**Files:**
- Modify: `src/components/assistant/ContextSidebar.tsx`
- Modify: `messages/en.json` (add translation keys)
- Modify: `messages/id.json` (add translation keys)

**Interfaces:**
- Consumes: `useChatStore` from `src/store/chat.store.ts`

- [ ] **Step 1: Add translation keys to en.json**

In `messages/en.json`, inside the `"Assistant"` object (around line 285), add:

```json
    "new_chat": "New Chat",
    "conversation_history": "Chat History",
    "rename": "Rename",
    "delete": "Delete",
    "delete_confirm": "Delete this conversation?",
    "no_conversations": "No conversations yet"
```

- [ ] **Step 2: Add translation keys to id.json**

In `messages/id.json`, inside the `"Assistant"` object, add:

```json
    "new_chat": "Obrolan Baru",
    "conversation_history": "Riwayat Obrolan",
    "rename": "Ubah Nama",
    "delete": "Hapus",
    "delete_confirm": "Hapus obrolan ini?",
    "no_conversations": "Belum ada obrolan"
```

- [ ] **Step 3: Add conversation list UI to ContextSidebar**

Replace the entire content of `src/components/assistant/ContextSidebar.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, FolderOpen, ChevronRight, Plus, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat.store';

interface ContextSidebarProps {
  onPromptSelect: (prompt: string) => void;
}

export function ContextSidebar({ onPromptSelect }: ContextSidebarProps) {
  const t = useTranslations('Assistant');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const {
    conversations,
    activeConversationId,
    createConversation,
    setActiveConversation,
    renameConversation,
    deleteConversation,
  } = useChatStore();

  const assistantConversations = conversations.filter((c) => c.type === 'assistant');

  const quickPrompts = [
    t('prompt_prioritize'),
    t('prompt_plan'),
    t('prompt_summary'),
  ];

  const contextItems = [
    { label: t('context_tasks'), value: 11, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: t('context_overdue'), value: 3, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { label: t('context_projects'), value: 2, icon: FolderOpen, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  ];

  const handleNewChat = () => {
    createConversation('assistant');
  };

  const handleRename = async (id: string) => {
    if (editTitle.trim()) {
      await renameConversation(id, editTitle.trim());
      setEditingId(null);
      setEditTitle('');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('delete_confirm'))) {
      await deleteConversation(id);
      setMenuOpenId(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 lg:w-[320px] shrink-0">
      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
      >
        <Plus className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold text-foreground">{t('new_chat')}</span>
      </button>

      {/* Conversation History */}
      <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4">{t('conversation_history')}</h3>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
          {assistantConversations.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">{t('no_conversations')}</p>
          ) : (
            assistantConversations.map((conversation, i) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'group relative flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all',
                  conversation.id === activeConversationId
                    ? 'border-primary/50 bg-primary/5 shadow-sm'
                    : 'border-border/40 bg-background hover:border-primary/30 hover:shadow-sm'
                )}
              >
                {editingId === conversation.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(conversation.id);
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditTitle('');
                      }
                    }}
                    onBlur={() => handleRename(conversation.id)}
                    className="flex-1 bg-transparent outline-none text-sm font-medium text-foreground"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setActiveConversation(conversation.id)}
                    className="flex-1 text-left"
                  >
                    <span className="text-muted-foreground group-hover:text-foreground font-medium transition-colors line-clamp-1">
                      {conversation.title}
                    </span>
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === conversation.id ? null : conversation.id)}
                    className="ml-2 flex h-6 w-6 items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-border/50 transition-all"
                  >
                    <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>

                  {menuOpenId === conversation.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-border/50 bg-card shadow-lg z-10">
                      <button
                        onClick={() => {
                          setEditingId(conversation.id);
                          setEditTitle(conversation.title);
                          setMenuOpenId(null);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-border/30 transition-colors rounded-t-lg"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {t('rename')}
                      </button>
                      <button
                        onClick={() => handleDelete(conversation.id)}
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors rounded-b-lg"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t('delete')}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4">{t('quick_prompts_title')}</h3>
        <div className="flex flex-col gap-2">
          {quickPrompts.map((prompt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onPromptSelect(prompt)}
              className="group flex w-full items-center justify-between rounded-xl border border-border/40 bg-background px-4 py-3 text-left text-sm transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <span className="text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                {prompt}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Context Awareness */}
      <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4">Workspace Context</h3>
        <div className="flex flex-col gap-3">
          {contextItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', item.bg)}>
                    <Icon className={cn('h-4 w-4', item.color)} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `cd e:\Project\Karsa\fe-karsa && npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/assistant/ContextSidebar.tsx messages/en.json messages/id.json
git commit -m "feat: add conversation list to assistant sidebar"
```

---

### Task 8: Add Sync Status Badge to MessageBubble

**Files:**
- Modify: `src/components/assistant/MessageBubble.tsx`

**Interfaces:**
- Consumes: `Message` interface with `syncStatus` field

- [ ] **Step 1: Update Message interface**

In `src/components/assistant/MessageBubble.tsx`, replace the `Message` interface (lines 10-15):

```tsx
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStructured?: boolean;
}
```

With:

```tsx
export interface Message {
  id: string;
  conversationId?: string;
  role: 'user' | 'assistant';
  content: string;
  isStructured?: boolean;
  createdAt?: string;
  orderIndex?: number;
  syncStatus?: 'pending' | 'synced' | 'error';
}
```

- [ ] **Step 2: Add sync status badge to message bubble**

After line 98 (the closing `</div>` of the content area), add:

```tsx
      {/* Sync Status Badge */}
      {message.syncStatus && message.syncStatus !== 'synced' && (
        <div className="mt-1 flex items-center gap-1">
          {message.syncStatus === 'pending' && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Syncing...
            </span>
          )}
          {message.syncStatus === 'error' && (
            <span className="text-xs text-rose-500 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Failed to sync
            </span>
          )}
        </div>
      )}
```

- [ ] **Step 3: Add AlertTriangle import**

Change line 5:

```tsx
import { Sparkles, User } from 'lucide-react';
```

To:

```tsx
import { Sparkles, User, AlertTriangle } from 'lucide-react';
```

- [ ] **Step 4: Verify build**

Run: `cd e:\Project\Karsa\fe-karsa && npm run build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/assistant/MessageBubble.tsx
git commit -m "feat: add sync status badge to message bubbles"
```

---

### Task 9: Initialize Chat Persistence in Dashboard Layout

**Files:**
- Modify: `src/app/[locale]/(dashboard)/layout.tsx` (or create if not exists)

**Interfaces:**
- Consumes: `useChatPersistence` from `src/store/chat.store.ts`

- [ ] **Step 1: Read dashboard layout file**

Read `src/app/[locale]/(dashboard)/layout.tsx` to understand current structure.

- [ ] **Step 2: Add useChatPersistence hook**

If the layout is a client component, add at the top of the component:

```tsx
import { useChatPersistence } from '@/store/chat.store';

// Inside the component:
useChatPersistence();
```

If the layout is a server component, create a client component wrapper:

Create `src/components/ChatPersistenceProvider.tsx`:

```tsx
'use client';

import { useChatPersistence } from '@/store/chat.store';

export function ChatPersistenceProvider({ children }: { children: React.ReactNode }) {
  useChatPersistence();
  return <>{children}</>;
}
```

Then in the dashboard layout, wrap children with this provider.

- [ ] **Step 3: Verify build**

Run: `cd e:\Project\Karsa\fe-karsa && npm run build`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize chat persistence in dashboard layout"
```

---

### Task 10: Manual Testing & Bug Fixes

**Files:**
- Test all modified files

**Interfaces:**
- None

- [ ] **Step 1: Test mini chat persistence**

1. Go to `/dashboard`
2. Expand mini chat
3. Send a message
4. Collapse mini chat
5. Expand again
6. **Expected:** Message is still visible

- [ ] **Step 2: Test full chat persistence**

1. Go to `/assistant`
2. Send multiple messages
3. Navigate to `/dashboard`
4. Navigate back to `/assistant`
5. **Expected:** All messages are still visible

- [ ] **Step 3: Test conversation switching**

1. Go to `/assistant`
2. Create a new chat (click "+ New Chat")
3. Send messages in the new conversation
4. Switch to an old conversation from the sidebar
5. **Expected:** Old messages appear
6. Switch back to the new conversation
7. **Expected:** New messages appear

- [ ] **Step 4: Test conversation rename and delete**

1. Hover over a conversation in the sidebar
2. Click the "..." menu
3. Click "Rename" and change the title
4. **Expected:** Title updates
5. Click "..." again and select "Delete"
6. **Expected:** Conversation is removed from list

- [ ] **Step 5: Test localStorage fallback**

1. Clear browser cache
2. Go to `/assistant`
3. Send messages
4. Refresh the page
5. **Expected:** Messages are restored from localStorage

- [ ] **Step 6: Fix any bugs found during testing**

Address issues found in manual testing.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "fix: resolve issues found during manual testing"
```

---

## Summary

This plan implements multi-conversation chat history with optimistic hybrid persistence across 10 tasks:

1. **Conversation Service** — API layer for backend sync
2. **Zustand Store** — State management with localStorage persistence
3. **Mini Chat Collapse Fix** — Keep mounted instead of unmounting
4. **MiniChat Integration** — Wire to store
5. **useAssistant Hook** — Auto-save messages
6. **ChatInterface Integration** — Wire to store
7. **Conversation List Sidebar** — UI for managing conversations
8. **Sync Status Badge** — Visual feedback for sync state
9. **Persistence Provider** — Initialize store on app mount
10. **Manual Testing** — Verify all features work

Total: 2 new files, 7 modified files, 2 translation files updated.
