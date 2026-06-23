'use client';

import { useCallback, useState } from 'react';
import {
  useTasksQuery,
  useTaskColumns,
  type Task,
  type TaskStatus,
  type Priority,
} from './use-tasks';
import { usePageFilters } from './use-page-filters';
import type { ViewMode } from '@/components/tasks/ViewToggle';
import type { SortOption } from '@/components/tasks/TaskList';

export interface TaskPageState {
  view: ViewMode;
  setView: (v: ViewMode) => void;

  search: string;
  status: TaskStatus | '';
  priority: Priority | '';
  sort: SortOption;
  setStatus: (v: TaskStatus | '') => void;
  setPriority: (v: Priority | '') => void;
  setSort: (v: SortOption) => void;
  onSearchChange: (v: string) => void;
  clearFilters: () => void;
  hasFilters: boolean;

  columns: ReturnType<typeof useTaskColumns>['data'];
  systemColumns: NonNullable<ReturnType<typeof useTaskColumns>['data']>;
  userColumns: NonNullable<ReturnType<typeof useTaskColumns>['data']>;
  tasks: Task[];
  orphanTasks: Task[];
  isLoading: boolean;

  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  editingTask: Task | null;
  defaultColumnId: string | undefined;
  handleCreateTask: (columnId?: string) => void;
  handleEditTask: (task: Task) => void;

  createBoardOpen: boolean;
  setCreateBoardOpen: (open: boolean) => void;
  handleAddBoard: () => void;

  queryParams: Record<string, unknown>;
}

export function useTaskPageState(): TaskPageState {
  const [view, setView] = useState<ViewMode>('board');
  const [sort, setSort] = useState<SortOption>('newest');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState<string | undefined>();
  const [createBoardOpen, setCreateBoardOpen] = useState(false);

  const filters = usePageFilters<TaskStatus, Priority>({ limit: 1000 });

  const { data: columnsData, isLoading: isLoadingCols } = useTaskColumns();
  const { data: tasksData, isLoading: isLoadingTasks } = useTasksQuery(
    filters.queryParams as Parameters<typeof useTasksQuery>[0],
  );

  const columns = columnsData || [];
  const tasks = tasksData?.data || [];
  const systemColumns = columns.filter((c) => c.isSystem);
  const userColumns = columns.filter((c) => !c.isSystem);
  const orphanTasks = tasks.filter((t) => !t.columnId).sort((a, b) => a.order - b.order);

  const handleCreateTask = useCallback((columnId?: string) => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setDialogOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setDefaultColumnId(undefined);
    setDialogOpen(true);
  }, []);

  const handleAddBoard = useCallback(() => setCreateBoardOpen(true), []);

  return {
    view,
    setView,
    search: filters.search,
    status: filters.status,
    priority: filters.priority,
    sort,
    setStatus: filters.setStatus,
    setPriority: filters.setPriority,
    setSort,
    onSearchChange: filters.onSearchChange,
    clearFilters: filters.clear,
    hasFilters: filters.hasFilters,
    columns,
    systemColumns,
    userColumns,
    tasks,
    orphanTasks,
    isLoading: isLoadingCols || isLoadingTasks,
    dialogOpen,
    setDialogOpen,
    editingTask,
    defaultColumnId,
    handleCreateTask,
    handleEditTask,
    createBoardOpen,
    setCreateBoardOpen,
    handleAddBoard,
    queryParams: filters.queryParams,
  };
}
