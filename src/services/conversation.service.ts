import { api } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  title: string;
  type: 'ASSISTANT' | 'MINI';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  isStructured?: boolean;
  syncStatus?: 'pending' | 'synced' | 'error';
  createdAt: string;
}

// ── Service ────────────────────────────────────────────────────────

export const ConversationService = {
  listConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await api.get<{ data: Conversation[] }>('/api/assistant/conversations');
      return response.data.data;
    } catch (error) {
      console.warn('Failed to fetch conversations:', error);
      return [];
    }
  },

  getConversation: async (
    id: string,
  ): Promise<{ conversation: Conversation; messages: Message[] } | null> => {
    try {
      const response = await api.get<{
        data: { conversation: Conversation; messages: Message[] };
      }>(`/api/assistant/conversations/${id}/messages`);
      return response.data.data;
    } catch (error) {
      console.warn(`Failed to fetch conversation ${id}:`, error);
      return null;
    }
  },

  createConversation: async (type: 'ASSISTANT' | 'MINI'): Promise<Conversation | null> => {
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
    updates: { title: string },
  ): Promise<Conversation | null> => {
    try {
      const response = await api.patch<{ data: Conversation }>(
        `/api/assistant/conversations/${id}`,
        updates,
      );
      return response.data.data;
    } catch (error) {
      console.warn(`Failed to update conversation ${id}:`, error);
      return null;
    }
  },

  deleteConversation: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/api/assistant/conversations/${id}`);
      return true;
    } catch (error) {
      console.warn(`Failed to delete conversation ${id}:`, error);
      return false;
    }
  },

  addMessage: async (
    conversationId: string,
    message: { role: 'user' | 'assistant'; content: string; isStructured?: boolean },
  ): Promise<Message | null> => {
    try {
      const response = await api.post<{ data: Message }>(
        `/api/assistant/conversations/${conversationId}/messages`,
        message,
      );
      return response.data.data;
    } catch (error) {
      console.warn(`Failed to add message to conversation ${conversationId}:`, error);
      return null;
    }
  },
};
