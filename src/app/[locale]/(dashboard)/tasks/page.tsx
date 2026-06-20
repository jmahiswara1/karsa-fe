'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskBoardColumn } from '@/components/tasks/TaskBoardColumn';
import { InboxColumn, INBOX_DROPPABLE_ID } from '@/components/tasks/InboxColumn';
import { CreateBoardDialog } from '@/components/tasks/CreateBoardDialog';
import { BoardSection } from '@/components/tasks/board-section';
import { ViewToggle, type ViewMode } from '@/components/tasks/ViewToggle';
import { TaskList, type SortOption } from '@/components/tasks/TaskList';
import {
  useTasksQuery,
  useTaskColumns,
  useReorderTasks,
  type Task,
  type TaskStatus,
  type Priority,
  type TasksResponse,
} from '@/hooks/use-tasks';
import { useQueryClient } from '@tanstack/react-query';

export default function TasksPage() {
  const t = useTranslations('Tasks');
  const tPages = useTranslations('Pages');
  const queryClient = useQueryClient();

  // View state
  const [view, setView] = useState<ViewMode>('board');

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');

  // Sort (for list view)
  const [sort, setSort] = useState<SortOption>('newest');

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
  const reorderTasks = useReorderTasks();

  const columns = columnsData || [];
  const tasks = tasksData?.data || [];

  // Partition columns into system (workflow stages) and user-created
  const systemColumns = columns.filter((c) => c.isSystem);
  const userColumns = columns.filter((c) => !c.isSystem);

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

  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const handleAddBoard = () => setCreateBoardOpen(true);

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

    // Determine destination columnId (null for Inbox, or actual column id)
    const destColumnId = destination.droppableId === INBOX_DROPPABLE_ID ? null : destination.droppableId;

    // Optimistically update UI
    const newTasks = Array.from(tasks);
    const [movedTask] = newTasks.splice(
      newTasks.findIndex((t) => t.id === draggableId),
      1
    );

    // Determine new status based on column name (or keep current if moving to Inbox)
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

    movedTask.columnId = destColumnId;
    movedTask.status = newStatus;
    
    // Calculate new order for destination column (or Inbox)
    const destTasks = newTasks.filter(t => {
      if (destColumnId === null) return !t.columnId;
      return t.columnId === destColumnId;
    }).sort((a, b) => a.order - b.order);
    
    destTasks.splice(destination.index, 0, movedTask);

    // Reassign orders for the destination column
    const updates = destTasks.map((t, index) => {
      t.order = index * 1000; // Provide gap
      return { 
        id: t.id, 
        order: t.order, 
        columnId: t.columnId ?? null,
        ...(t.id === movedTask.id ? { status: newStatus } : {})
      };
    });

    queryClient.setQueryData(['tasks', queryParams], (old: TasksResponse | undefined) => {
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

  // Filter orphan tasks (no columnId)
  const orphanTasks = tasks.filter((t) => !t.columnId).sort((a, b) => a.order - b.order);

  return (
    <div className="flex h-full flex-col space-y-6 pb-2">
      {/* Header */}
      <PageHeader
        title={tPages('tasks_title')}
        description={tPages('tasks_desc')}
        actions={
          <div className="flex items-center gap-3">
            <ViewToggle value={view} onChange={setView} />
            <Button onClick={() => handleCreateTask()} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('create_task')}
            </Button>
          </div>
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
        sort={sort}
        onSortChange={setSort}
      />

      {/* Content: Board or List */}
      {view === 'board' ? (
        <div className="flex-1 overflow-hidden pb-4 min-h-[500px]">
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
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex h-full gap-6 overflow-hidden">
                {/* Inbox - Fixed left column */}
                <div className="shrink-0">
                  <InboxColumn
                    tasks={orphanTasks}
                    onAddTask={() => handleCreateTask()}
                    onEditTask={handleEditTask}
                  />
                </div>

                {/* Right side: Workflow + Your boards */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-4">
                  {/* Workflow section - collapsible */}
                  {systemColumns.length > 0 && (
                    <BoardSection title={t('section_workflow')} storageKey="workflow">
                      {systemColumns.map((column) => {
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
                    </BoardSection>
                  )}

                  {/* Your boards section - collapsible */}
                  <BoardSection
                    title={t('section_your_boards')}
                    storageKey="yourBoards"
                  >
                    {userColumns.map((column) => {
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
                      {t('add_board')}
                    </button>
                  </BoardSection>
                </div>
              </div>
            </DragDropContext>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pb-4 min-h-[500px]">
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onEditTask={handleEditTask}
            sort={sort}
          />
        </div>
      )}

      {/* Create/Edit Dialog */}
      <TaskDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        task={editingTask} 
        defaultColumnId={defaultColumnId}
      />

      {/* Create Board Dialog */}
      <CreateBoardDialog
        open={createBoardOpen}
        onOpenChange={setCreateBoardOpen}
      />
    </div>
  );
}
