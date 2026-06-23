import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

// ── Types ──────────────────────────────────────────────────────────

export interface CalendarSyncResult {
  synced: number;
  updated: number;
  errors: string[];
}

export interface CalendarImportResult {
  imported: number;
}

export interface SyncPreviewEntry {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  googleEventId: string | null;
}

export interface SyncPreviewTask {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  priority: string;
  googleEventId: string | null;
  projectTitle: string | null;
}

export interface SyncPreviewAll {
  plannerEntries: SyncPreviewEntry[];
  tasks: SyncPreviewTask[];
}

export interface CalendarEvent {
  id: string;
  summary?: string | null;
  description?: string | null;
  start?: { dateTime?: string | null; date?: string | null } | null;
  end?: { dateTime?: string | null; date?: string | null } | null;
}

export interface SyncLogEntry {
  id: string;
  userId: string;
  action: string;
  syncedCount: number;
  updatedCount: number;
  failedCount: number;
  errors: string | null;
  rangeStart: string | null;
  rangeEnd: string | null;
  createdAt: string;
}

// ── Hooks ──────────────────────────────────────────────────────────

export const useCalendarStatus = () => {
  return useQuery({
    queryKey: ['planner', 'calendar-status'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: { connected: boolean } }>(
        '/api/planner/calendar/status',
      );
      return data.data.connected;
    },
  });
};

export const useSyncPreview = (params: {
  startDate: string;
  endDate: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ['planner', 'sync-preview', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set('startDate', params.startDate);
      searchParams.set('endDate', params.endDate);
      const { data } = await api.get<{ success: boolean; data: SyncPreviewAll }>(
        `/api/planner/calendar/sync-preview?${searchParams.toString()}`,
      );
      return data.data;
    },
    enabled: params.enabled,
  });
};

export const useSyncToCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { startDate: string; endDate: string; timeZone?: string }) => {
      const { data } = await api.post<{
        success: boolean;
        data: CalendarSyncResult;
        message: string;
      }>('/api/planner/calendar/sync-to-calendar', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', 'calendar-status'] });
    },
  });
};

export const useSyncTasksToCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { startDate: string; endDate: string; timeZone?: string }) => {
      const { data } = await api.post<{
        success: boolean;
        data: CalendarSyncResult;
        message: string;
      }>('/api/planner/calendar/sync-tasks-to-calendar', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', 'calendar-status'] });
    },
  });
};

export const useSyncAllToCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { startDate: string; endDate: string; timeZone?: string }) => {
      const { data } = await api.post<{
        success: boolean;
        data: { planner: CalendarSyncResult; tasks: CalendarSyncResult };
        message: string;
      }>('/api/planner/calendar/sync-all-to-calendar', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', 'calendar-status'] });
    },
  });
};

export const useImportFromCalendar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { startDate: string; endDate: string }) => {
      const { data } = await api.post<{
        success: boolean;
        data: CalendarImportResult;
        message: string;
      }>('/api/planner/calendar/import-from-calendar', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', 'entries'] });
    },
  });
};

export const useForceResetCalendarSync = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{
        success: boolean;
        data: { reset: number };
        message: string;
      }>('/api/planner/calendar/force-reset');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['planner', 'entries'] });
      queryClient.invalidateQueries({ queryKey: ['planner', 'sync-preview'] });
    },
  });
};

export const useCalendarEvents = (params: {
  startDate: string;
  endDate: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ['planner', 'calendar-events', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      searchParams.set('startDate', params.startDate);
      searchParams.set('endDate', params.endDate);
      const { data } = await api.get<{
        success: boolean;
        data: CalendarEvent[];
      }>(`/api/planner/calendar/events?${searchParams.toString()}`);
      return data.data;
    },
    enabled: params.enabled,
  });
};

export const useSyncHistory = () => {
  return useQuery({
    queryKey: ['planner', 'sync-history'],
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: SyncLogEntry[];
      }>('/api/planner/calendar/sync-history');
      return data.data;
    },
  });
};
