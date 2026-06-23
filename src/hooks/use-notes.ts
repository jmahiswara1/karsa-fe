import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface Note {
  id: string;
  title: string;
  content: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  projectId: string | null;
  folderId: string | null;
  project?: {
    id: string;
    title: string;
  } | null;
  folder?: {
    id: string;
    name: string;
  } | null;
  tags?: unknown[];
}

export interface NotesQueryParams {
  projectId?: string;
  folderId?: string | null;
  search?: string;
  page?: number;
  limit?: number;
}

export interface NotesResponse {
  success: boolean;
  data: Note[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateNoteInput {
  title: string;
  content: string;
  projectId?: string;
  folderId?: string | null;
}

export type UpdateNoteInput = Partial<CreateNoteInput>;

export const useNotesQuery = (params: NotesQueryParams = {}) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.projectId) searchParams.set('projectId', params.projectId);
      if (params.folderId !== undefined)
        searchParams.set('folderId', params.folderId === null ? 'null' : params.folderId);
      if (params.search) searchParams.set('search', params.search);
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit) searchParams.set('limit', String(params.limit));

      const { data } = await api.get<NotesResponse>(`/api/notes?${searchParams.toString()}`);
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useNoteQuery = (id: string) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Note }>(`/api/notes/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateNoteInput) => {
      const { data } = await api.post('/api/notes', input);
      return data.data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateNoteInput & { id: string }) => {
      const { data } = await api.patch(`/api/notes/${id}`, input);
      return data.data as Note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useReorderNotes = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notes: { id: string; order: number }[]) => {
      await api.patch('/api/notes/reorder', { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
