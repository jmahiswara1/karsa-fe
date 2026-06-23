'use client';

import { useTranslations } from 'next-intl';
import { PageIntro } from '@/components/shared/page-header';
import { TasksToolbar } from '@/components/tasks/TasksToolbar';
import { TasksBoard } from '@/components/tasks/TasksBoard';
import { TasksDialogs } from '@/components/tasks/TasksDialogs';
import { TaskList } from '@/components/tasks/TaskList';
import { useTaskPageState } from '@/hooks/use-task-page-state';
import { useTaskDragDrop } from '@/hooks/use-task-drag-drop';

export default function TasksPage() {
  const tPages = useTranslations('Pages');
  const state = useTaskPageState();

  const { onDragEnd } = useTaskDragDrop({
    tasks: state.tasks,
    columns: state.columns ?? [],
    queryParams: state.queryParams,
  });

  return (
    <div className="flex h-full flex-col space-y-6 pb-2">
      <PageIntro title={tPages('tasks_title')} subtitle={tPages('tasks_desc')} />

      <TasksToolbar
        view={state.view}
        onViewChange={state.setView}
        search={state.search}
        onSearchChange={state.onSearchChange}
        status={state.status}
        onStatusChange={state.setStatus}
        priority={state.priority}
        onPriorityChange={state.setPriority}
        sort={state.sort}
        onSortChange={state.setSort}
        onClear={state.clearFilters}
        onCreateTask={() => state.handleCreateTask()}
      />

      {state.view === 'board' ? (
        <TasksBoard
          isLoading={state.isLoading}
          systemColumns={state.systemColumns}
          userColumns={state.userColumns}
          tasks={state.tasks}
          orphanTasks={state.orphanTasks}
          onDragEnd={onDragEnd}
          onAddTask={state.handleCreateTask}
          onEditTask={state.handleEditTask}
          onAddBoard={state.handleAddBoard}
        />
      ) : (
        <div className="min-h-[500px] flex-1 overflow-y-auto pb-4">
          <TaskList
            tasks={state.tasks}
            isLoading={state.isLoading}
            onEditTask={state.handleEditTask}
            sort={state.sort}
          />
        </div>
      )}

      <TasksDialogs
        dialogOpen={state.dialogOpen}
        onDialogOpenChange={state.setDialogOpen}
        editingTask={state.editingTask}
        defaultColumnId={state.defaultColumnId}
        createBoardOpen={state.createBoardOpen}
        onCreateBoardOpenChange={state.setCreateBoardOpen}
      />
    </div>
  );
}
