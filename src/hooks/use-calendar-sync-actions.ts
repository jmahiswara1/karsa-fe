'use client';

import { useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import {
  useSyncToCalendar,
  useSyncTasksToCalendar,
  useSyncAllToCalendar,
  useImportFromCalendar,
  useForceResetCalendarSync,
} from './use-calendar-google-sync';
import { showSyncResultToast } from '@/components/calendar/SyncResultToast';

type SyncMode = 'planner' | 'tasks' | 'all';

interface SyncRange {
  startDate: string;
  endDate: string;
}

interface UseCalendarSyncActionsResult {
  handleSyncConfirm: (mode: SyncMode, range: SyncRange) => void;
  handleImportConfirm: (range: SyncRange) => void;
  handleForceReset: () => void;
  isAnySyncing: boolean;
  isImporting: boolean;
  isResetting: boolean;
}

/**
 * Encapsulates calendar sync side-effects: optimistic invalidation,
 * toast feedback, and combined result aggregation for "sync all".
 */
export function useCalendarSyncActions(
  onSyncPreviewClose: () => void,
  onImportClose: () => void,
): UseCalendarSyncActionsResult {
  const tCal = useTranslations('Calendar');
  const queryClient = useQueryClient();

  const syncToCalendar = useSyncToCalendar();
  const syncTasksToCalendar = useSyncTasksToCalendar();
  const syncAllToCalendar = useSyncAllToCalendar();
  const importFromCalendar = useImportFromCalendar();
  const forceReset = useForceResetCalendarSync();

  const handleSyncConfirm = useCallback(
    (mode: SyncMode, range: SyncRange) => {
      const onSuccess = (data: { data: unknown }) => {
        if (mode === 'all') {
          const d = data.data as {
            planner: { synced: number; updated: number; errors: string[] };
            tasks: { synced: number; updated: number; errors: string[] };
          };
          const combined = {
            synced: d.planner.synced + d.tasks.synced,
            updated: d.planner.updated + d.tasks.updated,
            errors: [...d.planner.errors, ...d.tasks.errors],
          };
          showSyncResultToast(combined);
        } else {
          showSyncResultToast(data.data as { synced: number; updated: number; errors: string[] });
        }
        onSyncPreviewClose();
        queryClient.invalidateQueries({ queryKey: ['planner', 'sync-history'] });
      };

      const onError = () => toast.error(tCal('sync_error'));

      if (mode === 'planner') {
        syncToCalendar.mutate(range, { onSuccess, onError });
      } else if (mode === 'tasks') {
        syncTasksToCalendar.mutate(range, { onSuccess, onError });
      } else {
        syncAllToCalendar.mutate(range, { onSuccess, onError });
      }
    },
    [syncToCalendar, syncTasksToCalendar, syncAllToCalendar, onSyncPreviewClose, queryClient, tCal],
  );

  const handleImportConfirm = useCallback(
    (range: SyncRange) => {
      importFromCalendar.mutate(range, {
        onSuccess: (data) => {
          toast.success(data.message || tCal('import_success'));
          onImportClose();
          queryClient.invalidateQueries({ queryKey: ['planner', 'entries'] });
          queryClient.invalidateQueries({ queryKey: ['planner', 'sync-history'] });
        },
        onError: () => toast.error(tCal('import_error')),
      });
    },
    [importFromCalendar, onImportClose, queryClient, tCal],
  );

  const handleForceReset = useCallback(() => {
    forceReset.mutate(undefined, {
      onSuccess: (data) => {
        toast.success(data.message || tCal('force_resync_success'));
        queryClient.invalidateQueries({ queryKey: ['planner', 'sync-history'] });
      },
      onError: () => toast.error(tCal('force_resync_error')),
    });
  }, [forceReset, tCal, queryClient]);

  const isAnySyncing =
    syncToCalendar.isPending || syncTasksToCalendar.isPending || syncAllToCalendar.isPending;

  return {
    handleSyncConfirm,
    handleImportConfirm,
    handleForceReset,
    isAnySyncing,
    isImporting: importFromCalendar.isPending,
    isResetting: forceReset.isPending,
  };
}

/** Returns the date range for the current view mode. */
export function useCalendarSyncRange(queryParams: {
  date?: string;
  startDate?: string;
  endDate?: string;
}): SyncRange {
  return useMemo(() => {
    return {
      startDate:
        'startDate' in queryParams && queryParams.startDate
          ? queryParams.startDate
          : (queryParams.date ?? ''),
      endDate:
        'endDate' in queryParams && queryParams.endDate
          ? queryParams.endDate
          : (queryParams.date ?? ''),
    };
  }, [queryParams]);
}
