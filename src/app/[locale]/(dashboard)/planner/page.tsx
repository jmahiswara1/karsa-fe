'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/shared/page-header';
import { MoodEnergySelector } from '@/components/planner/MoodEnergySelector';
import { PlannerHeader } from '@/components/planner/PlannerHeader';
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
  return date.toISOString().split('T')[0];
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
  const [energy, setEnergy] = useState('MEDIUM');
  const [mood, setMood] = useState('NEUTRAL');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [defaultHour, setDefaultHour] = useState(8);

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
            date: formatDate(date),
          },
          { onSuccess: () => setDialogOpen(false) },
        );
      }
    },
    [editingEntry, date, updateEntry, createEntry],
  );

  const handleDelete = useCallback(() => {
    if (editingEntry) {
      deleteEntry.mutate(editingEntry.id, {
        onSuccess: () => setDialogOpen(false),
      });
    }
  }, [editingEntry, deleteEntry]);

  const handleGenerate = useCallback(() => {
    generatePlan.mutate({
      energyLevel: energy,
      mood,
      date: formatDate(date),
    });
  }, [energy, mood, date, generatePlan]);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title={tPages('planner_title')} description={tPages('planner_desc')} />

      <PlannerHeader
        date={date}
        viewMode={viewMode}
        onDateChange={setDate}
        onViewModeChange={setViewMode}
        onGenerate={handleGenerate}
        isGenerating={generatePlan.isPending}
      >
        <MoodEnergySelector
          energy={energy}
          onEnergyChange={setEnergy}
          mood={mood}
          onMoodChange={setMood}
        />
      </PlannerHeader>

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
        />
      ) : viewMode === 'week' ? (
        <WeekView
          date={date}
          entries={entries}
          onEntryClick={handleEntryClick}
          onSlotClick={handleSlotClick}
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

      {/* Entry Dialog */}
      <PlannerEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editingEntry}
        defaultHour={defaultHour}
        onSubmit={handleDialogSubmit}
        onDelete={editingEntry ? handleDelete : undefined}
        isSubmitting={createEntry.isPending || updateEntry.isPending}
      />
    </div>
  );
}
