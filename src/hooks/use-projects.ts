import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  priority: Priority;
  deadline: string | null;
  progress: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  _count?: {
    tasks: number;
  };
  tasks?: any[];
  notes?: any[];
}

export interface ProjectsQueryParams {
  status?: ProjectStatus;
  priority?: Priority;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  status?: ProjectStatus;
  priority?: Priority;
  deadline?: string;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

// ── Hooks ──────────────────────────────────────────────────────────

export const useProjectsQuery = (params: ProjectsQueryParams = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.set('status', params.status);
      if (params.priority) searchParams.set('priority', params.priority);
      if (params.search) searchParams.set('search', params.search);
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit) searchParams.set('limit', String(params.limit));

      const { data } = await api.get<ProjectsResponse>(`/api/projects?${searchParams.toString()}`);
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useProjectQuery = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Project }>(`/api/projects/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => {
      const { data } = await api.post('/api/projects', input);
      return data.data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateProjectInput & { id: string }) => {
      const { data } = await api.patch(`/api/projects/${id}`, input);
      return data.data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
