import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface NoteFolder {
  id: string;
  name: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    notes: number;
    children: number;
  };
}

// Hooks

export function useNoteFoldersQuery(parentId?: string | null) {
  return useQuery({
    queryKey: ['note-folders', parentId],
    queryFn: async () => {
      const p = parentId === null ? 'null' : parentId;
      const res = await api.get<{ success: boolean; data: NoteFolder[] }>('/api/note-folders', {
        params: p !== undefined ? { parentId: p } : undefined,
      });
      return res.data.data;
    },
  });
}

export function useCreateNoteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; parentId?: string | null }) => {
      const res = await api.post('/api/note-folders', data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['note-folders'] });
      // If we are showing notes and folders mixed, invalidating notes might be needed if they share UI state, but usually folders are fetched separately.
    },
  });
}

export function useUpdateNoteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<{ name: string; parentId: string | null }> }) => {
      const res = await api.patch(`/api/note-folders/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note-folders'] });
    },
  });
}

export function useDeleteNoteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/note-folders/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['note-folders'] });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
