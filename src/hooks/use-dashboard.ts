import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface DashboardSummary {
  todayTasks: any[];
  taskSummary: {
    total: number;
    inProgress: number;
    done: number;
    overdue: number;
  };
  activeProjects: any[];
  upcomingDeadlines: any[];
  recentNotes: any[];
  todaySchedule: any[];
}

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: DashboardSummary }>('/api/dashboard/summary');
      return data.data;
    },
  });
};
