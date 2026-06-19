# Chat Session History — Design Spec

**Date:** 2026-06-17  
**Status:** Approved  
**Approach:** Optimistic Hybrid (Zustand + localStorage + Backend sync)

## Problem

Chat messages in the AI assistant disappear in two scenarios:

1. **Full chat (`/assistant`)** — navigating away unmounts `ChatInterface.tsx`, destroying `useState`-based messages
2. **Mini chat (`/dashboard`)** — collapsing the chat unmounts `MiniChat.tsx` via conditional rendering (`{isExpanded && <MiniChat />}`)

Both components use `useState<Message[]>([])` with zero persistence — no localStorage, no Zustand store, no backend history.

## Solution Overview

Add multi-conversation chat history with optimistic hybrid persistence:

- **Zustand store + localStorage** as primary read layer (instant, no loading states)
- **Backend API** as source of truth for cross-device sync
- Messages appear instantly from local state, sync to backend in the background
- Append-only conflict resolution (messages are never edited/deleted by users)

Two independent chat contexts:
- **Full chat (`/assistant`)** — full conversation list with sidebar, rename, delete, switch between conversations
- **Mini chat (`/dashboard`)** — single active conversation only, no list UI, but persists through collapse/reopen

## Data Model

### Conversation

| Field | Type | Description |
|---|---|---|
| `id` | string (UUID) | Unique identifier |
| `title` | string | Auto-generated from first user message (first 6 words + "..."), editable |
| `type` | `"assistant"` \| `"mini"` | Which chat UI created this conversation |
| `userId` | string | Owner user |
| `createdAt` | datetime | When created |
| `updatedAt` | datetime | Last message timestamp (used for sorting) |

### Message

| Field | Type | Description |
|---|---|---|
| `id` | string (UUID) | Unique identifier |
| `conversationId` | string (FK) | Parent conversation |
| `role` | `"user"` \| `"assistant"` | Who sent it |
| `content` | string | Message text (supports markdown) |
| `isStructured` | boolean (optional) | Whether content contains structured data |
| `createdAt` | datetime | When sent |
| `orderIndex` | number | Ordering within conversation |

## Backend API Design

### Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/assistant/conversations` | List all conversations for the authenticated user (paginated, sorted by `updatedAt` desc) |
| `GET` | `/api/assistant/conversations/:id` | Get conversation details with all messages |
| `POST` | `/api/assistant/conversations` | Create a new conversation `{ type: "assistant" \| "mini" }` |
| `PATCH` | `/api/assistant/conversations/:id` | Update conversation `{ title }` |
| `DELETE` | `/api/assistant/conversations/:id` | Delete conversation and all its messages |
| `POST` | `/api/assistant/conversations/:id/messages` | Add a message `{ role, content }` |
| `POST` | `/api/assistant/chat` | *(existing — no change)* Send prompt, receive AI reply |

### Message Send Flow

1. Frontend → `POST /api/assistant/conversations/:id/messages` (save user message)
2. Frontend → `POST /api/assistant/chat` (get AI reply) — existing endpoint, unchanged
3. Frontend → `POST /api/assistant/conversations/:id/messages` (save assistant reply)

All API calls happen in the background. UI updates instantly from Zustand store.

## Zustand Chat Store

### Store Structure

```
useChatStore
├── State:
│   ├── conversations: Conversation[]        // All conversations
│   ├── activeConversationId: string | null  // Currently open conversation
│   ├── messages: Message[]                  // Messages of active conversation
│   └── syncStatus: "idle" | "syncing" | "error"
│
├── Actions:
│   ├── createConversation(type)             // Create new, set as active
│   ├── setActiveConversation(id)            // Switch conversation
│   ├── renameConversation(id, title)        // Rename conversation
│   ├── deleteConversation(id)              // Delete + switch to next available
│   ├── addUserMessage(content)             // Optimistic push to messages[]
│   ├── addAssistantMessage(content)        // Push AI reply to messages[]
│   ├── syncFromBackend()                   // Fetch + merge from backend
│   └── syncToBackend(conversationId)       // Push local changes to backend
│
└── Persistence:
    ├── Zustand persist middleware → localStorage
    └── Key: "chat-store-{userId}"
```

### Persistence Strategy (Optimistic Hybrid)

**App mount / component mount:**
1. Zustand hydrates from localStorage → instant display (no loading spinner)
2. Background: fetch conversations list from backend
3. Merge: backend is source of truth — add any conversations/messages that exist on backend but not locally
4. Update localStorage with merged state

**User sends a message:**
1. Zustand → push message to state + localStorage (instant in UI)
2. Background: `POST` message to backend
3. On failure → retry 3x with exponential backoff, then show "⚠️ Failed to sync" badge on message bubble

**User switches conversation:**
1. Set `activeConversationId` in store (instant)
2. If messages exist in localStorage → display immediately
3. Background: fetch messages from backend if there are newer ones
4. Merge by message ID, sort by `orderIndex`

**Collapse/expand mini chat:**
1. Keep MiniChat mounted (CSS hide instead of unmount) — primary protection
2. Zustand store as secondary protection — even if component unmounts, messages hydrate instantly from store

### Conflict Resolution

Chat is append-only (messages are never edited or deleted by users), so conflict resolution is straightforward:

```
On sync:
1. Fetch messages from backend for active conversation
2. Union all messages by ID
3. Messages in localStorage without backend ID → not yet synced, push to backend
4. Messages on backend without localStorage ID → newly received, add to local state
5. Sort all by orderIndex
```

### Auto-Title Generation

- New conversation → title = "New Chat"
- After user's first message → title = first 6 words of user message + "..."
- Generated once, never changes automatically after that
- User can rename manually at any time

## UI Changes

### `/assistant` — Full Chat Page

ContextSidebar gains a conversation list above the existing quick prompts:

```
┌─────────────────────────────────────────────────┐
│ ContextSidebar                  │   Chat Area    │
│ ┌─────────────────────────┐    │                 │
│ │ [+ New Chat] button     │    │  (messages)     │
│ ├─────────────────────────┤    │                 │
│ │ Conversation List:       │    │                 │
│ │ • "Cara setup project"   │    │                 │
│ │ • "Debug error 500"     │    │                 │
│ │ • "Best practice React" │    │                 │
│ ├─────────────────────────┤    │                 │
│ │ Quick Prompts:           │    │                 │
│ │ • "Buatkan task list"   │    │                 │
│ │ • "Review code ini"     │    │                 │
│ └─────────────────────────┘    │                 │
└─────────────────────────────────────────────────┘
```

- Sidebar shows conversation list sorted by `updatedAt` desc
- Click conversation → switch to it (instant from store)
- "..." button on each conversation → rename or delete
- "+ New Chat" button at top → create new conversation
- Empty state → welcome screen (same as current)

### `/dashboard` — Mini Chat

Minimal changes:
- No conversation list — only the single active conversation
- Keep MiniChat mounted when collapsed (CSS `max-h-0` + `overflow-hidden` instead of conditional render)
- Messages persist through collapse/reopen via both CSS trick and Zustand store
- Small "🗑️ Clear" button to reset conversation (optional, creates new conversation)
- `isExpanded` state persisted in localStorage

### Collapse Fix (GreetingBanner)

```tsx
// Before (messages lost on collapse)
{isExpanded && <MiniChat />}

// After (stays mounted, only hidden)
<div className={cn(
  "overflow-hidden transition-all duration-300",
  isExpanded ? "max-h-[400px]" : "max-h-0"
)}>
  <MiniChat />
</div>
```

## Error Handling

| Scenario | Behavior |
|---|---|
| Backend offline / network error | Message appears in UI (optimistic). Show "⚠️ Gagal sinkronisasi" badge on bubble. Auto-retry 3x with exponential backoff. |
| Backend error (500) | Same as offline — message visible in UI, error badge shown. No automatic retry. |
| localStorage vs backend conflict | Backend = source of truth. Merge by ID as described above. |
| Token expired | Redirect to login (existing behavior from `api.ts`). Chat state preserved in localStorage. |
| Sync failed permanently | Messages remain in localStorage and UI. Next app mount triggers another sync attempt. |

## File Changes

### New Files

| File | Purpose |
|---|---|
| `src/store/chat.store.ts` | Zustand store — conversations, messages, persistence, sync logic |
| `src/services/conversation.service.ts` | API service — CRUD conversations and messages |

### Modified Files

| File | Changes |
|---|---|
| `src/components/assistant/ChatInterface.tsx` | Replace `useState` with Zustand store. Integrate sync logic on mount. |
| `src/components/assistant/ContextSidebar.tsx` | Add conversation list with switch/rename/delete. Add "New Chat" button. |
| `src/components/assistant/MessageBubble.tsx` | Add sync status badge (⚠️ for failed sync). Update `Message` interface with `conversationId` field. |
| `src/components/dashboard/MiniChat.tsx` | Replace `useState` with Zustand store. |
| `src/components/dashboard/GreetingBanner.tsx` | Fix collapse: keep MiniChat mounted with CSS hide instead of conditional render. Persist `isExpanded` in localStorage. |
| `src/hooks/use-assistant.ts` | Integrate store: auto-save user and assistant messages after sending. |

## Implementation Order

1. **`src/services/conversation.service.ts`** — API service (can be stubbed with localStorage-only initially)
2. **`src/store/chat.store.ts`** — Zustand store with localStorage persistence
3. **`src/components/dashboard/GreetingBanner.tsx`** — Fix collapse bug (quick win)
4. **`src/components/dashboard/MiniChat.tsx`** — Wire up to store
5. **`src/hooks/use-assistant.ts`** — Integrate store auto-save
6. **`src/components/assistant/ChatInterface.tsx`** — Wire up to store
7. **`src/components/assistant/ContextSidebar.tsx`** — Add conversation list UI
8. **`src/components/assistant/MessageBubble.tsx`** — Add sync status badge

## Out of Scope

- Search within conversation history
- Export/import conversations
- Sharing conversations between users
- Conversation branching/forking
- Streaming AI responses (existing behavior)
- Backend implementation (API design provided for reference, but implementation is frontend-focused)
