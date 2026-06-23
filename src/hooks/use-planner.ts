import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────

export interface LinkedTask {
  id: string;
  title: string;
  priority: string;
  status: string;
}

export type PlannerCategory = 'FOCUS' | 'BREAK' | 'MEETING' | 'PERSONAL' | 'OTHER';

export interface PlannerEntry {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  category: PlannerCategory;
  taskId: string | null;
  isAiGenerated: boolean;
  aiReason: string | null;
  color: string | null;
  googleEventId: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  task: LinkedTask | null;
}

export interface GeneratePlanInput {
  energyLevel: string;
  mood: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface GeneratePlanResult {
  blocks: PlannerEntry[];
  focusMessage: string | null;
  workloadLevel: string;
}

export interface CreateEntryInput {
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  category?: PlannerCategory;
  taskId?: string;
  isAiGenerated?: boolean;
  aiReason?: string;
  color?: string;
  order?: number;
}

export type UpdateEntryInput = Partial<CreateEntryInput>;

// ── Hooks ──────────────────────────────────────────────────────────

export const usePlannerEntries = (params: {
  date?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['planner', 'entries', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.date) searchParams.set('date', params.date);
      if (params.startDate) searchParams.set('startDate', params.startDate);
      if (params.endDate) searchParams.set('endDate', params.endDate);

      const { data } = await api.get<{ success: boolean; data: PlannerEntry[] }>(
        `/api/planner/entries?${searchParams.toString()}`,
      );
      return data.data;
    },
  });
};

export const useCreateEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEntryInput) => {
      const { data } = await api.post<{ success: boolean; data: PlannerEntry }>(
        '/api/planner/entries',
        input,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', 'entries'] });
    },
  });
};

export const useUpdateEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateEntryInput & { id: string }) => {
      const { data } = await api.patch<{ success: boolean; data: PlannerEntry }>(
        `/api/planner/entries/${id}`,
        input,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', 'entries'] });
    },
  });
};

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/planner/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', 'entries'] });
    },
  });
};

export const useGeneratePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: GeneratePlanInput) => {
      const { data } = await api.post<{ success: boolean; data: GeneratePlanResult }>(
        '/api/planner/generate',
        input,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', 'entries'] });
    },
  });
};
