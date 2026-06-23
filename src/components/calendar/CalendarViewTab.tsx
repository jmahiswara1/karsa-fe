'use client';

import { ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarHeader } from './CalendarHeader';
import { ViewSwitcher, type ViewMode } from './ViewSwitcher';
import { CalendarStats } from './CalendarStats';
import { UnifiedCalendarView } from './UnifiedCalendarView';
import type { PlannerEntry } from '@/hooks/use-planner';
import type { CalendarEvent } from '@/hooks/use-calendar-google-sync';

interface CalendarViewTabProps {
  date: Date;
  viewMode: ViewMode;
  onDateChange: (d: Date) => void;
  onViewModeChange: (v: ViewMode) => void;
  onDayClick: (d: Date) => void;

  entries: PlannerEntry[];
  googleEvents: CalendarEvent[];
  isLoading: boolean;

  onEntryClick: (e: PlannerEntry) => void;
  onSlotClick: (dateStr: string, hour: number) => void;
  onEntryDrop: (id: string, date: string, hour: number) => void;

  onGenerate: () => void;
  isGenerating: boolean;
  onSyncPlannerPreview: () => void;
  onSyncTasksPreview: () => void;
  onSyncAllPreview: () => void;
  onImportFromCalendar: () => void;
  onForceReset: () => void;
  isSyncing: boolean;
  isImporting: boolean;
  isCalendarConnected: boolean;
}

export function CalendarViewTab({
  date,
  viewMode,
  onDateChange,
  onViewModeChange,
  onDayClick,
  entries,
  googleEvents,
  isLoading,
  onEntryClick,
  onSlotClick,
  onEntryDrop,
  onGenerate,
  isGenerating,
  onSyncPlannerPreview,
  onSyncTasksPreview,
  onSyncAllPreview,
  onImportFromCalendar,
  onForceReset,
  isSyncing,
  isImporting,
  isCalendarConnected,
}: CalendarViewTabProps) {
  return (
    <>
      <CalendarStats entries={entries} googleEventCount={googleEvents.length} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CalendarHeader
          date={date}
          viewMode={viewMode}
          onDateChange={onDateChange}
          onGenerate={onGenerate}
          isGenerating={isGenerating}
          onSyncPlannerPreview={onSyncPlannerPreview}
          onSyncTasksPreview={onSyncTasksPreview}
          onSyncAllPreview={onSyncAllPreview}
          onImportFromCalendar={onImportFromCalendar}
          onForceReset={onForceReset}
          isSyncing={isSyncing}
          isImporting={isImporting}
          isCalendarConnected={isCalendarConnected}
        />
        <ViewSwitcher viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>

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
          onEntryClick={onEntryClick}
          onSlotClick={onSlotClick}
          onEntryDrop={onEntryDrop}
          onDayClick={onDayClick}
        />
      )}
    </>
  );
}

/** Re-export the shared banner chip used by planner & calendar pages. */
export function EntriesCountChip({ count }: { count: number }) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/15 px-4 text-sm font-medium text-white/90 backdrop-blur-sm">
      <ListChecks className="h-4 w-4" />
      {count}
    </div>
  );
}
