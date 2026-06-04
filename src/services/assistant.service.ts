import { api } from '@/lib/api';

export interface ChatResponse {
  message: string;
  data: {
    reply: string;
    action: string | null;
    action_data: unknown;
  };
}

export const AssistantService = {
  chat: async (prompt: string): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/assistant/chat', { prompt });
    return response.data;
  },
};
