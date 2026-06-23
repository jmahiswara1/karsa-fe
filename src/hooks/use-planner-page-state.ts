'use client';

import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { formatLocalDate } from '@/lib/date-utils';
import {
  usePlannerEntries,
  useCreateEntry,
  useUpdateEntry,
  useDeleteEntry,
  useGeneratePlan,
  type PlannerEntry,
  type PlannerCategory,
} from './use-planner';

export interface PlannerPageState {
  date: Date;
  setDate: (d: Date) => void;

  entries: PlannerEntry[];
  isLoading: boolean;

  lastFocusMessage: string | null;

  // Entry dialog
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingEntry: PlannerEntry | null;
  defaultHour: number;
  clickedDate: string;
  handleAddClick: () => void;
  handleEntryClick: (e: PlannerEntry) => void;
  handleDialogSubmit: (data: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    category: PlannerCategory;
  }) => void;
  handleDelete: () => void;
  isSubmitting: boolean;

  // Reorder
  handleReorder: (reordered: PlannerEntry[]) => void;

  // Generate
  generateDialogOpen: boolean;
  setGenerateDialogOpen: (open: boolean) => void;
  handleGenerate: (data: {
    startDate: string;
    endDate: string;
    energy: string;
    mood: string;
  }) => void;
  isGenerating: boolean;

  queryParams: { date: string };
}

export function usePlannerPageState(): PlannerPageState {
  const queryClient = useQueryClient();

  const [date, setDate] = useState(new Date());
  const [lastFocusMessage, setLastFocusMessage] = useState<string | null>(null);

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [defaultHour, setDefaultHour] = useState(8);
  const [clickedDate, setClickedDate] = useState(formatLocalDate(date));

  const queryParams = useMemo(() => ({ date: formatLocalDate(date) }), [date]);

  const { data: entries = [], isLoading } = usePlannerEntries(queryParams);
  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();
  const generatePlan = useGeneratePlan();

  const handleAddClick = useCallback(() => {
    setEditingEntry(null);
    setDefaultHour(8);
    setClickedDate(formatLocalDate(date));
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
      deleteEntry.mutate(editingEntry.id, { onSuccess: () => setDialogOpen(false) });
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
      queryClient.setQueryData(['planner', 'entries', queryParams], reordered);
      reordered.forEach((entry, index) => {
        if (entry.order !== index) {
          updateEntry.mutate({ id: entry.id, order: index });
        }
      });
    },
    [queryClient, queryParams, updateEntry],
  );

  return {
    date,
    setDate,
    entries,
    isLoading,
    lastFocusMessage,
    dialogOpen,
    setDialogOpen,
    editingEntry,
    defaultHour,
    clickedDate,
    handleAddClick,
    handleEntryClick,
    handleDialogSubmit,
    handleDelete,
    isSubmitting: createEntry.isPending || updateEntry.isPending,
    handleReorder,
    generateDialogOpen,
    setGenerateDialogOpen,
    handleGenerate,
    isGenerating: generatePlan.isPending,
    queryParams,
  };
}
