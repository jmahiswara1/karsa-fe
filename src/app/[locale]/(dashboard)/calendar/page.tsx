'use client';

import { formatLocalDate } from '@/lib/date-utils';
import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, Settings, ListChecks } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { PageBanner } from '@/components/shared/PageBanner';
import { CalendarHeader } from '@/components/calendar/CalendarHeader';
import { ViewSwitcher, type ViewMode } from '@/components/calendar/ViewSwitcher';
import { MobileTabBar } from '@/components/calendar/MobileTabBar';
import { GeneratePlanDialog } from '@/components/planner/GeneratePlanDialog';
import { PlannerEntryDialog } from '@/components/planner/PlannerEntryDialog';
import { SyncPreviewDialog } from '@/components/calendar/SyncPreviewDialog';
import { ImportFromCalendarDialog } from '@/components/calendar/ImportFromCalendarDialog';
import { CalendarStats } from '@/components/calendar/CalendarStats';
import { UnifiedCalendarView } from '@/components/calendar/UnifiedCalendarView';
import { CalendarSettings } from '@/components/calendar/CalendarSettings';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  usePlannerEntries,
  useCreateEntry,
  useUpdateEntry,
  useDeleteEntry,
  useGeneratePlan,
  type PlannerEntry,
  type PlannerCategory,
} from '@/hooks/use-planner';
import {
  useCalendarStatus,
  useSyncToCalendar,
  useSyncTasksToCalendar,
  useSyncAllToCalendar,
  useImportFromCalendar,
  useForceResetCalendarSync,
  useCalendarEvents,
} from '@/hooks/use-calendar-sync';
import { showSyncResultToast } from '@/components/calendar/SyncResultToast';

type Tab = 'view' | 'settings';

function formatDate(date: Date): string {
  return formatLocalDate(date);
}

function getWeekRange(date: Date): { startDate: string; endDate: string } {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

const tabs: { key: Tab; icon: typeof CalendarIcon; labelKey: string }[] = [
  { key: 'view', icon: CalendarIcon, labelKey: 'tab_view' },
  { key: 'settings', icon: Settings, labelKey: 'tab_settings' },
];

export default function CalendarPage() {
  const tCal = useTranslations('Calendar');
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [activeTab, setActiveTab] = useState<Tab>('view');

  // Dialog state
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [defaultHour, setDefaultHour] = useState(8);
  const [clickedDate, setClickedDate] = useState(formatDate(date));
  const [syncPreviewMode, setSyncPreviewMode] = useState<'planner' | 'tasks' | 'all' | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Queries
  const queryParams = useMemo(() => {
    if (viewMode === 'day') return { date: formatDate(date) };
    if (viewMode === 'week') return getWeekRange(date);
    return {
      startDate: formatDate(new Date(date.getFullYear(), date.getMonth(), 1)),
      endDate: formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
    };
  }, [viewMode, date]);

  const { data: entries = [], isLoading } = usePlannerEntries(queryParams);
  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();
  const generatePlan = useGeneratePlan();
  const { data: isCalendarConnected = false } = useCalendarStatus();
  const syncToCalendar = useSyncToCalendar();
  const syncTasksToCalendar = useSyncTasksToCalendar();
  const syncAllToCalendar = useSyncAllToCalendar();
  const importFromCalendar = useImportFromCalendar();
  const forceReset = useForceResetCalendarSync();

  const syncRange = useMemo(() => {
    const range = queryParams;
    return {
      startDate: 'startDate' in range ? range.startDate : formatDate(date),
      endDate: 'endDate' in range ? range.endDate : formatDate(date),
    };
  }, [queryParams, date]);

  const { data: googleEvents = [] } = useCalendarEvents({
    startDate: syncRange.startDate,
    endDate: syncRange.endDate,
    enabled: isCalendarConnected,
  });

  // Handlers
  const handleSlotClick = useCallback((dateStr: string, hour: number) => {
    setEditingEntry(null);
    setDefaultHour(hour);
    setClickedDate(dateStr);
    setDialogOpen(true);
  }, []);

  const handleEntryClick = useCallback((entry: PlannerEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  }, []);

  const handleDialogSubmit = useCallback(
    (data: {
      title: string;
      description?: string;
      startTime: string;
      endTime: string;
      category: PlannerCategory;
    }) => {
      if (editingEntry) {
        updateEntry.mutate(
          { id: editingEntry.id, ...data },
          { onSuccess: () => setDialogOpen(false) },
        );
      } else {
        createEntry.mutate(
          { ...data, date: clickedDate },
          { onSuccess: () => setDialogOpen(false) },
        );
      }
    },
    [editingEntry, clickedDate, updateEntry, createEntry],
  );

  const handleDelete = useCallback(() => {
    if (editingEntry) {
      deleteEntry.mutate(editingEntry.id, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  }, [editingEntry, deleteEntry]);

  const handleEntryDrop = useCallback(
    (entryId: string, newDate: string, newHour: number) => {
      const entry = entries.find((e) => e.id === entryId);
      const startTime = `${String(newHour).padStart(2, '0')}:00`;
      let endTime = `${String(newHour + 1).padStart(2, '0')}:00`;

      if (entry) {
        const [sh, sm] = entry.startTime.split(':').map(Number);
        const [eh, em] = entry.endTime.split(':').map(Number);
        const durationMin = eh * 60 + em - (sh * 60 + sm);
        const endMinutes = newHour * 60 + durationMin;
        const endH = Math.floor(endMinutes / 60);
        const endM = endMinutes % 60;
        endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
      }

      updateEntry.mutate({ id: entryId, date: newDate, startTime, endTime });
    },
    [updateEntry, entries],
  );

  const handleGenerate = useCallback(
    (data: { startDate: string; endDate: string; energy: string; mood: string }) => {
      generatePlan.mutate(
        {
          energyLevel: data.energy,
          mood: data.mood,
          startDate: data.startDate,
          endDate: data.endDate,
        },
        { onSuccess: () => setGenerateDialogOpen(false) },
      );
    },
    [generatePlan],
  );

  // Sync handlers
  const handleSyncPlannerPreview = useCallback(() => setSyncPreviewMode('planner'), []);
  const handleSyncTasksPreview = useCallback(() => setSyncPreviewMode('tasks'), []);
  const handleSyncAllPreview = useCallback(() => setSyncPreviewMode('all'), []);
  const handleImportFromCalendar = useCallback(() => setImportDialogOpen(true), []);

  const handleSyncConfirm = useCallback(() => {
    if (syncPreviewMode === 'planner') {
      syncToCalendar.mutate(syncRange, {
        onSuccess: (data) => {
          showSyncResultToast(data.data);
          setSyncPreviewMode(null);
          queryClient.invalidateQueries({ queryKey: ['planner', 'sync-history'] });
        },
        onError: () => toast.error(tCal('sync_error')),
      });
    } else if (syncPreviewMode === 'tasks') {
      syncTasksToCalendar.mutate(syncRange, {
        onSuccess: (data) => {
          showSyncResultToast(data.data);
          setSyncPreviewMode(null);
          queryClient.invalidateQueries({ queryKey: ['planner', 'sync-history'] });
        },
        onError: () => toast.error(tCal('sync_error')),
      });
    } else if (syncPreviewMode === 'all') {
      syncAllToCalendar.mutate(syncRange, {
        onSuccess: (data) => {
          const combined = {
            synced: data.data.planner.synced + data.data.tasks.synced,
            updated: data.data.planner.updated + data.data.tasks.updated,
            errors: [...data.data.planner.errors, ...data.data.tasks.errors],
          };
          showSyncResultToast(combined);
          setSyncPreviewMode(null);
          queryClient.invalidateQueries({ queryKey: ['planner', 'sync-history'] });
        },
        onError: () => toast.error(tCal('sync_error')),
      });
    }
  }, [
    syncPreviewMode,
    syncToCalendar,
    syncTasksToCalendar,
    syncAllToCalendar,
    syncRange,
    tCal,
    queryClient,
  ]);

  const handleImportConfirm = useCallback(() => {
    importFromCalendar.mutate(syncRange, {
      onSuccess: (data) => {
        toast.success(data.message || tCal('import_success'));
        setImportDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['planner', 'entries'] });
        queryClient.invalidateQueries({ queryKey: ['planner', 'sync-history'] });
      },
      onError: () => toast.error(tCal('import_error')),
    });
  }, [importFromCalendar, syncRange, queryClient, tCal]);

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

  return (
    <div className="space-y-4 pb-24 sm:pb-8">
      {/* Greeting Banner */}
      <PageBanner
        user={user}
        subtitle={date.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
        })}
        rightSlot={
          <div className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/15 px-4 text-sm font-medium text-white/90 backdrop-blur-sm">
            <ListChecks className="h-4 w-4" />
            {entries.length}
          </div>
        }
      />

      {/* Tab Navigation */}
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4" />
              {tCal(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {activeTab === 'view' ? (
        <>
          {/* Calendar Stats */}
          <CalendarStats entries={entries} googleEventCount={googleEvents.length} />

          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CalendarHeader
              date={date}
              viewMode={viewMode}
              onDateChange={setDate}
              onGenerate={() => setGenerateDialogOpen(true)}
              isGenerating={generatePlan.isPending}
              onSyncPlannerPreview={handleSyncPlannerPreview}
              onSyncTasksPreview={handleSyncTasksPreview}
              onSyncAllPreview={handleSyncAllPreview}
              onImportFromCalendar={handleImportFromCalendar}
              onForceReset={handleForceReset}
              isSyncing={isAnySyncing}
              isImporting={importFromCalendar.isPending}
              isCalendarConnected={isCalendarConnected}
            />
            <ViewSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Calendar Views */}
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          ) : (
            <UnifiedCalendarView
              viewMode={viewMode}
              date={date}
              entries={entries}
              googleEvents={googleEvents}
              onEntryClick={handleEntryClick}
              onSlotClick={handleSlotClick}
              onEntryDrop={handleEntryDrop}
              onDayClick={(d) => {
                setDate(d);
                setViewMode('day');
              }}
            />
          )}
        </>
      ) : (
        <CalendarSettings
          connected={isCalendarConnected}
          onForceReset={handleForceReset}
          isResetting={forceReset.isPending}
        />
      )}

      {/* Mobile Tab Bar */}
      <MobileTabBar viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Dialogs */}
      <PlannerEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editingEntry}
        defaultHour={defaultHour}
        defaultDate={clickedDate}
        onSubmit={handleDialogSubmit}
        onDelete={editingEntry ? handleDelete : undefined}
        isSubmitting={createEntry.isPending || updateEntry.isPending}
      />

      <GeneratePlanDialog
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        defaultDate={date}
        onGenerate={handleGenerate}
        isGenerating={generatePlan.isPending}
      />

      <SyncPreviewDialog
        open={syncPreviewMode !== null}
        onOpenChange={() => setSyncPreviewMode(null)}
        startDate={syncRange.startDate}
        endDate={syncRange.endDate}
        onConfirm={handleSyncConfirm}
        isSyncing={isAnySyncing}
        mode={syncPreviewMode ?? 'planner'}
      />

      <ImportFromCalendarDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        startDate={syncRange.startDate}
        endDate={syncRange.endDate}
        onConfirm={handleImportConfirm}
        isImporting={importFromCalendar.isPending}
      />
    </div>
  );
}
