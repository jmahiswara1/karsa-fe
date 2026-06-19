import { api } from '@/lib/api';

export interface ChatResponse {
  reply: string;
  action: string | null;
  action_data: unknown;
}

export type EntityType = 'task' | 'project' | 'note' | 'planner_entry';
export type EntityStatus = 'pending_confirmation' | 'created' | 'failed' | 'cancelled';

export interface EntityCreation {
  type: EntityType;
  id?: string;
  title: string;
  status: EntityStatus;
  data?: Record<string, unknown>;
  error?: string;
}

export interface CreateEntitiesRequest {
  prompt: string;
  context?: Record<string, unknown>;
}

export interface CreateEntitiesResponse {
  reply: string;
  entities: EntityCreation[];
}

export const AssistantService = {
  chat: async (prompt: string): Promise<ChatResponse> => {
    const response = await api.post<{ data: ChatResponse }>('/api/assistant/chat', {
      prompt,
    });
    return response.data.data;
  },

  createEntities: async (prompt: string): Promise<CreateEntitiesResponse> => {
    const response = await api.post<{ data: CreateEntitiesResponse }>(
      '/api/assistant/create-entities',
      { prompt },
    );
    return response.data.data;
  },
};
