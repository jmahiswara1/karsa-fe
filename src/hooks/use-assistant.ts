import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AssistantService } from '@/services/assistant.service';

export function useAssistant() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
  };
}
