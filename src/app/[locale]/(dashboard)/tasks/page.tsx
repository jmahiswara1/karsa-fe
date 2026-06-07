'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import { Plus, LayoutTemplate } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskBoardColumn } from '@/components/tasks/TaskBoardColumn';
import {
  useTasksQuery,
  useTaskColumns,
  useCreateTaskColumn,
  useReorderTasks,
  type Task,
  type TaskStatus,
  type Priority,
} from '@/hooks/use-tasks';
import { EmptyState } from '@/components/shared/empty-state';
import { useQueryClient } from '@tanstack/react-query';

export default function TasksPage() {
  const t = useTranslations('Tasks');
  const tPages = useTranslations('Pages');
  const queryClient = useQueryClient();

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');

  // Dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState<string | undefined>();

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => setDebouncedSearch(value), 500);
    return () => clearTimeout(timeout);
  }, []);

  const queryParams = useMemo(
    () => ({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(status && { status }),
      ...(priority && { priority }),
      limit: 1000, // Fetch all for board view
    }),
    [debouncedSearch, status, priority],
  );

  const { data: columnsData, isLoading: isLoadingCols } = useTaskColumns();
  const { data: tasksData, isLoading: isLoadingTasks } = useTasksQuery(queryParams);
  const createColumn = useCreateTaskColumn();
  const reorderTasks = useReorderTasks();

  const columns = columnsData || [];
  const tasks = tasksData?.data || [];

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDefaultColumnId(undefined);
    setDialogOpen(true);
  };

  const handleCreateTask = (columnId?: string) => {
    setEditingTask(null);
    setDefaultColumnId(columnId);
    setDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('');
    setPriority('');
  };

  const handleAddBoard = () => {
    const name = prompt('Enter new board name:');
    if (name) {
      createColumn.mutate(name);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the task
    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Optimistically update UI
    const newTasks = Array.from(tasks);
    const [movedTask] = newTasks.splice(
      newTasks.findIndex((t) => t.id === draggableId),
      1
    );

    // Determine new status based on column name
    const destColumn = columns.find((c) => c.id === destination.droppableId);
    let newStatus = movedTask.status;
    if (destColumn) {
      const colName = destColumn.name.toLowerCase();
      if (colName.includes('todo') || colName.includes('to do') || colName.includes('to-do')) {
        newStatus = 'TODO';
      } else if (colName.includes('progress') || colName.includes('doing') || colName.includes('active')) {
        newStatus = 'IN_PROGRESS';
      } else if (colName.includes('done') || colName.includes('complete') || colName.includes('finish')) {
        newStatus = 'DONE';
      }
    }

    movedTask.columnId = destination.droppableId;
    movedTask.status = newStatus;
    
    // Calculate new order
    const destTasks = newTasks.filter(t => t.columnId === destination.droppableId)
      .sort((a, b) => a.order - b.order);
    
    destTasks.splice(destination.index, 0, movedTask);

    // Reassign orders for the destination column
    const updates = destTasks.map((t, index) => {
      t.order = index * 1000; // Provide gap
      return { 
        id: t.id, 
        order: t.order, 
        columnId: t.columnId || undefined,
        ...(t.id === movedTask.id ? { status: newStatus } : {})
      };
    });

    queryClient.setQueryData(['tasks', queryParams], (old: any) => {
      if (!old) return old;
      // Replace tasks
      const updatedData = old.data.map((t: Task) => {
        const update = updates.find(u => u.id === t.id);
        if (update) {
          return { 
            ...t, 
            order: update.order, 
            columnId: update.columnId,
            ...(update.status ? { status: update.status } : {}) 
          };
        }
        return t;
      });
      return { ...old, data: updatedData };
    });

    // Send to backend
    reorderTasks.mutate(updates);
  };

  const isLoading = isLoadingCols || isLoadingTasks;

  return (
    <div className="flex h-full flex-col space-y-6 pb-2">
      {/* Header */}
      <PageHeader
        title={tPages('tasks_title')}
        description={tPages('tasks_desc')}
        actions={
          <Button onClick={() => handleCreateTask()} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('create_task')}
          </Button>
        }
      />

      {/* Filters */}
      <TaskFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={(v) => setStatus(v)}
        priority={priority}
        onPriorityChange={(v) => setPriority(v)}
        onClear={handleClearFilters}
      />

      {/* Board Layout */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 min-h-[500px]">
        {isLoading ? (
          <div className="flex gap-6 h-full">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex h-full w-80 shrink-0 flex-col gap-3 rounded-xl bg-muted/40 p-3.5">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-28 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : columns.length === 0 ? (
          <EmptyState
            icon={LayoutTemplate}
            title="No boards found"
            description="Create your first board to get started."
            action={
              <Button onClick={handleAddBoard} className="gap-2 mt-4">
                <Plus className="h-4 w-4" />
                Add Board
              </Button>
            }
          />
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex h-full gap-6 items-start">
              {columns.map((column) => {
                const columnTasks = tasks
                  .filter((t) => t.columnId === column.id)
                  .sort((a, b) => a.order - b.order);

                return (
                  <TaskBoardColumn
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onAddTask={handleCreateTask}
                    onEditTask={handleEditTask}
                  />
                );
              })}

              {/* Add Board Button */}
              <button
                onClick={handleAddBoard}
                className="flex h-12 w-80 shrink-0 items-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 text-sm font-medium text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Board
              </button>
            </div>
          </DragDropContext>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <TaskDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        task={editingTask} 
        defaultColumnId={defaultColumnId}
      />
    </div>
  );
}
