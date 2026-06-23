import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface DashboardSummary {
  todayTasks: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  taskSummary: {
    total: number;
    inProgress: number;
    done: number;
    overdue: number;
  };
  activeProjects: {
    id: string;
    title: string;
    progress: number;
    color: string;
    taskCount: number;
  }[];
  upcomingDeadlines: { id: string; title: string; deadline: string | null; type: string }[];
  recentNotes: { id: string; title: string; updatedAt: string }[];
  todaySchedule: { id: string; title: string; startTime: string; endTime: string }[];
}

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: DashboardSummary }>(
        '/api/dashboard/summary',
      );
      return data.data;
    },
  });
};
