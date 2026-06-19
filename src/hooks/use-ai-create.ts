import { useMutation } from '@tanstack/react-query';
import { AssistantService, CreateEntitiesResponse } from '@/services/assistant.service';

export function useAiCreate() {
  const mutation = useMutation({
    mutationFn: async (prompt: string): Promise<CreateEntitiesResponse> => {
      return AssistantService.createEntities(prompt);
    },
  });

  return {
    createEntities: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
}
