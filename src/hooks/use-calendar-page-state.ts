'use client';

import { useCallback, useMemo, useState } from 'react';
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
import type { ViewMode } from '@/components/calendar/ViewSwitcher';

export type CalendarTab = 'view' | 'settings';
export type SyncPreviewMode = 'planner' | 'tasks' | 'all' | null;

function getWeekRange(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { startDate: formatLocalDate(start), endDate: formatLocalDate(end) };
}

export interface CalendarPageState {
  date: Date;
  setDate: (d: Date) => void;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  activeTab: CalendarTab;
  setActiveTab: (t: CalendarTab) => void;

  entries: PlannerEntry[];
  isLoading: boolean;

  // Entry dialog
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingEntry: PlannerEntry | null;
  defaultHour: number;
  clickedDate: string;
  handleSlotClick: (dateStr: string, hour: number) => void;
  handleEntryClick: (entry: PlannerEntry) => void;
  handleDialogSubmit: (data: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    category: PlannerCategory;
  }) => void;
  handleDelete: () => void;
  handleEntryDrop: (entryId: string, newDate: string, newHour: number) => void;
  isSubmitting: boolean;

  // Generate plan
  generateDialogOpen: boolean;
  setGenerateDialogOpen: (open: boolean) => void;
  handleGenerate: (data: {
    startDate: string;
    endDate: string;
    energy: string;
    mood: string;
  }) => void;
  isGenerating: boolean;

  // Sync preview
  syncPreviewMode: SyncPreviewMode;
  setSyncPreviewMode: (m: SyncPreviewMode) => void;

  // Import
  importDialogOpen: boolean;
  setImportDialogOpen: (open: boolean) => void;

  queryParams: { date?: string; startDate?: string; endDate?: string };
}

export function useCalendarPageState(): CalendarPageState {
  const [date, setDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [activeTab, setActiveTab] = useState<CalendarTab>('view');

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PlannerEntry | null>(null);
  const [defaultHour, setDefaultHour] = useState(8);
  const [clickedDate, setClickedDate] = useState(formatLocalDate(date));
  const [syncPreviewMode, setSyncPreviewMode] = useState<SyncPreviewMode>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const queryParams = useMemo(() => {
    if (viewMode === 'day') return { date: formatLocalDate(date) };
    if (viewMode === 'week') return getWeekRange(date);
    return {
      startDate: formatLocalDate(new Date(date.getFullYear(), date.getMonth(), 1)),
      endDate: formatLocalDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
    };
  }, [viewMode, date]);

  const { data: entries = [], isLoading } = usePlannerEntries(queryParams);
  const createEntry = useCreateEntry();
  const updateEntry = useUpdateEntry();
  const deleteEntry = useDeleteEntry();
  const generatePlan = useGeneratePlan();

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
      deleteEntry.mutate(editingEntry.id, { onSuccess: () => setDialogOpen(false) });
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

  return {
    date,
    setDate,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    entries,
    isLoading,
    dialogOpen,
    setDialogOpen,
    editingEntry,
    defaultHour,
    clickedDate,
    handleSlotClick,
    handleEntryClick,
    handleDialogSubmit,
    handleDelete,
    handleEntryDrop,
    isSubmitting: createEntry.isPending || updateEntry.isPending,
    generateDialogOpen,
    setGenerateDialogOpen,
    handleGenerate,
    isGenerating: generatePlan.isPending,
    syncPreviewMode,
    setSyncPreviewMode,
    importDialogOpen,
    setImportDialogOpen,
    queryParams,
  };
}
