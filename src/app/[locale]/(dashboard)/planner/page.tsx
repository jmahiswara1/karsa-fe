'use client';

import { formatLocalDate } from '@/lib/date-utils';
import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/shared/page-header';
import { PlannerHeader } from '@/components/planner/PlannerHeader';
import { GeneratePlanDialog } from '@/components/planner/GeneratePlanDialog';
import { DayView } from '@/components/planner/DayView';
import { WeekView } from '@/components/planner/WeekView';
import { MonthView } from '@/components/planner/MonthView';
import { PlannerEntryDialog } from '@/components/planner/PlannerEntryDialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  usePlannerEntries,
  useCreateEntry,
  useUpdateEntry,
  useDeleteEntry,
  useGeneratePlan,
  type PlannerEntry,
} from '@/hooks/use-planner';

type ViewMode = 'day' | 'week' | 'month';

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

  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
}

export default function PlannerPage() {
  const tPages = useTranslations('Pages');

  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  // Dialog state
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [defaultHour, setDefaultHour] = useState(8);
  const [clickedDate, setClickedDate] = useState(formatDate(date));

  // Queries
  const queryParams =
    viewMode === 'day'
      ? { date: formatDate(date) }
      : viewMode === 'week'
        ? getWeekRange(date)
        : {
            startDate: formatDate(new Date(date.getFullYear(), date.getMonth(), 1)),
            endDate: formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
          };

  const { data: entries = [], isLoading } = usePlannerEntries(queryParams);
  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();
  const generatePlan = useGeneratePlan();

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
    (data: { title: string; description?: string; startTime: string; endTime: string }) => {
      if (editingEntry) {
        updateEntry.mutate(
          { id: editingEntry.id, ...data },
          { onSuccess: () => setDialogOpen(false) },
        );
      } else {
        createEntry.mutate(
          {
            ...data,
            date: clickedDate,
          },
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
        {
          onSuccess: () => setGenerateDialogOpen(false),
        },
      );
    },
    [generatePlan],
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title={tPages('planner_title')} description={tPages('planner_desc')} />

      <PlannerHeader
        date={date}
        viewMode={viewMode}
        onDateChange={setDate}
        onViewModeChange={setViewMode}
        onGenerate={() => setGenerateDialogOpen(true)}
        isGenerating={generatePlan.isPending}
      />

      {/* Calendar */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      ) : viewMode === 'day' ? (
        <DayView
          date={date}
          entries={entries}
          onEntryClick={handleEntryClick}
          onSlotClick={handleSlotClick}
          onEntryDrop={handleEntryDrop}
        />
      ) : viewMode === 'week' ? (
        <WeekView
          date={date}
          entries={entries}
          onEntryClick={handleEntryClick}
          onSlotClick={handleSlotClick}
          onEntryDrop={handleEntryDrop}
        />
      ) : (
        <MonthView
          date={date}
          entries={entries}
          onDayClick={(d) => {
            setDate(d);
            setViewMode('day');
          }}
        />
      )}

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

      {/* Generate Plan Dialog */}
      <GeneratePlanDialog
        open={generateDialogOpen}
        onOpenChange={setGenerateDialogOpen}
        defaultDate={date}
        onGenerate={handleGenerate}
        isGenerating={generatePlan.isPending}
      />
    </div>
  );
}
