'use client';

import { formatLocalDate } from '@/lib/date-utils';
import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQueryClient } from '@tanstack/react-query';
import { PlannerGreetingCard } from '@/components/planner/PlannerGreetingCard';
import { PlannerHeader } from '@/components/planner/PlannerHeader';
import { FocusList } from '@/components/planner/FocusList';
import { EmptyFocus } from '@/components/planner/EmptyFocus';
import { GeneratePlanDialog } from '@/components/planner/GeneratePlanDialog';
import { PlannerEntryDialog } from '@/components/planner/PlannerEntryDialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  usePlannerEntries,
  useCreateEntry,
  useUpdateEntry,
  useDeleteEntry,
  useGeneratePlan,
  type PlannerEntry,
  type PlannerCategory,
} from '@/hooks/use-planner';

function formatDate(date: Date): string {
  return formatLocalDate(date);
}

export default function FocusPage() {
  const tFocus = useTranslations('Focus');
  const queryClient = useQueryClient();

  const [date, setDate] = useState(new Date());

  // Dialog state
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [defaultHour, setDefaultHour] = useState(8);
  const [clickedDate, setClickedDate] = useState(formatDate(date));

  // Track last AI focus message
  const [lastFocusMessage, setLastFocusMessage] = useState<string | null>(null);

  // Queries
  const queryParams = useMemo(() => ({ date: formatDate(date) }), [date]);

  const { data: entries = [], isLoading } = usePlannerEntries(queryParams);
  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();
  const generatePlan = useGeneratePlan();

  // Handlers
  const handleAddClick = useCallback(() => {
    setEditingEntry(null);
    setDefaultHour(8);
    setClickedDate(formatDate(date));
    setDialogOpen(true);
  }, [date]);

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
          onSuccess: (result) => {
            setGenerateDialogOpen(false);
            if (result?.focusMessage) {
              setLastFocusMessage(result.focusMessage);
            }
          },
        },
      );
    },
    [generatePlan],
  );

  const handleReorder = useCallback(
    (reordered: PlannerEntry[]) => {
      // Optimistically update local state via query cache
      queryClient.setQueryData(['planner', 'entries', queryParams], reordered);
      // Persist order changes
      reordered.forEach((entry, index) => {
        if (entry.order !== index) {
          updateEntry.mutate({ id: entry.id, order: index });
        }
      });
    },
    [queryClient, queryParams, updateEntry],
  );

  return (
    <div className="space-y-4 pb-24 sm:pb-8">
      {/* Greeting Card */}
      <PlannerGreetingCard
        entryCount={entries.length}
        date={date}
        focusMessage={lastFocusMessage}
      />

      {/* Header */}
      <PlannerHeader
        date={date}
        viewMode="day"
        onDateChange={setDate}
        onGenerate={() => setGenerateDialogOpen(true)}
        isGenerating={generatePlan.isPending}
        onAdd={handleAddClick}
      />

      {/* Focus List */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyFocus
          onSuggest={() => setGenerateDialogOpen(true)}
          onAdd={handleAddClick}
          isGenerating={generatePlan.isPending}
        />
      ) : (
        <FocusList entries={entries} onItemClick={handleEntryClick} onReorder={handleReorder} />
      )}

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
    </div>
  );
}
