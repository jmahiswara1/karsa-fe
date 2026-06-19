# Task 1: Create Conversation Service

**Project:** Chat Session History - Multi-conversation persistence with optimistic hybrid sync

**Goal:** Create API service layer for conversation and message management with backend sync

## Requirements

Create `src/services/conversation.service.ts` that provides:
- Type definitions for Conversation and Message
- API methods: listConversations, getConversation, createConversation, updateConversation, deleteConversation, addMessage
- All methods use the existing `api` Axios instance from `src/lib/api.ts`
- Graceful error handling with console warnings (frontend works with localStorage fallback)

## Type Definitions

```typescript
export interface Conversation {
  id: string;
  title: string;
  type: 'assistant' | 'mini';
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  isStructured?: boolean;
  syncStatus?: 'pending' | 'synced' | 'error';
  createdAt: string; // ISO date string
}
```

## API Endpoints

| Method | Endpoint | Request Body | Response |
|--------|----------|--------------|----------|
| GET | `/api/assistant/conversations` | - | `Conversation[]` |
| GET | `/api/assistant/conversations/:id/messages` | - | `Message[]` |
| POST | `/api/assistant/conversations` | `{ title, type }` | `Conversation` |
| PATCH | `/api/assistant/conversations/:id` | `{ title }` | `Conversation` |
| DELETE | `/api/assistant/conversations/:id` | - | `{ success: true }` |
| POST | `/api/assistant/conversations/:id/messages` | `{ role, content }` | `Message` |

## Global Constraints

- Use existing `api` Axios instance from `@/lib/api.ts` (handles auth cookies + token refresh)
- All API calls must be async and return typed responses
- Catch errors with try/catch, log warnings, but don't throw (frontend has localStorage fallback)
- Response format from backend: `{ success: boolean, data: T }` where T is the entity
- Extract `.data` from response wrapper before returning

## Acceptance Criteria

- [ ] File created at `src/services/conversation.service.ts`
- [ ] All 6 API methods implemented
- [ ] TypeScript types exported
- [ ] Error handling in place (no throws)
- [ ] Can be imported by other modules

## Notes

- This is the first layer of the optimistic hybrid pattern
- Backend may not be implemented yet, so errors are expected and handled gracefully
- The Zustand store (Task 2) will consume this service
