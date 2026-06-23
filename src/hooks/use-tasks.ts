import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/lib/api';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface TaskColumn {
  id: string;
  name: string;
  order: number;
  isSystem: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  deadline: string | null;
  estimate: number | null;
  projectId: string | null;
  columnId: string | null;
  order: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  project: { id: string; title: string } | null;
  column: { id: string; name: string; isSystem: boolean } | null;
}

export interface TasksQueryParams {
  status?: TaskStatus;
  priority?: Priority;
  projectId?: string;
  columnId?: string;
  deadline?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TasksResponse {
  success: boolean;
  data: Task[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId?: string;
  columnId?: string;
  status?: TaskStatus;
  priority?: Priority;
  deadline?: string;
  estimate?: number;
  order?: number;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export const useTaskColumns = () => {
  return useQuery({
    queryKey: ['task-columns'],
    queryFn: async () => {
      const { data } = await api.get<{ data: TaskColumn[] }>('/api/task-columns');
      return data.data;
    },
  });
};

export const useCreateTaskColumn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data } = await api.post('/api/task-columns', { name });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-columns'] });
    },
  });
};

export const useUpdateTaskColumn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { data } = await api.patch(`/api/task-columns/${id}`, { name });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-columns'] });
    },
  });
};

export const useDeleteTaskColumn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/task-columns/${id}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['task-columns'] });
      queryClient.refetchQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useTasksQuery = (params: TasksQueryParams = {}) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.status) searchParams.set('status', params.status);
      if (params.priority) searchParams.set('priority', params.priority);
      if (params.projectId) searchParams.set('projectId', params.projectId);
      if (params.columnId) searchParams.set('columnId', params.columnId);
      if (params.deadline) searchParams.set('deadline', params.deadline);
      if (params.search) searchParams.set('search', params.search);
      if (params.page) searchParams.set('page', String(params.page));
      if (params.limit) searchParams.set('limit', String(params.limit));

      const { data } = await api.get<TasksResponse>(`/api/tasks?${searchParams.toString()}`);
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useTodayTasks = (status?: TaskStatus) => {
  return useTasksQuery({ deadline: 'today', status, limit: 20 });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const { data } = await api.post('/api/tasks', input);
      return data.data as Task;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tasks'] });
      queryClient.refetchQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateTaskInput & { id: string }) => {
      const { data } = await api.patch(`/api/tasks/${id}`, input);
      return data.data as Task;
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tasks'] });
      queryClient.refetchQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });
};

export const useReorderTasks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      tasks: { id: string; order: number; columnId?: string | null; status?: TaskStatus }[],
    ) => {
      await api.post('/api/tasks/reorder', { tasks });
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tasks'] });
      queryClient.refetchQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['tasks'] });
      queryClient.refetchQueries({ queryKey: ['dashboard'] });
      queryClient.refetchQueries({ queryKey: ['projects'] });
    },
  });
};

export const useProjectsList = () => {
  return useQuery({
    queryKey: ['projects', 'list'],
    queryFn: async () => {
      const { data } = await api.get('/api/projects?limit=100');
      return data.data as { id: string; title: string }[];
    },
  });
};

export const columnIdForStatus = (status: TaskStatus, columns: TaskColumn[]): string | null => {
  const keywordMap: Record<TaskStatus, string[]> = {
    TODO: ['todo', 'to do', 'to-do'],
    IN_PROGRESS: ['progress', 'doing', 'active'],
    DONE: ['done', 'complete', 'finish'],
    CANCELLED: ['cancel'],
  };

  const keywords = keywordMap[status] || [];
  const col = columns.find(
    (c) => c.isSystem && keywords.some((kw) => c.name.toLowerCase().includes(kw)),
  );
  return col?.id ?? null;
};
