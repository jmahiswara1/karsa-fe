'use client';

import { useTranslations } from 'next-intl';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { SkeletonGrid } from '@/components/shared/SkeletonGrid';
import { TaskBoardColumn } from './TaskBoardColumn';
import { InboxColumn } from './InboxColumn';
import { BoardSection } from './board-section';
import type { Task, TaskColumn } from '@/hooks/use-tasks';

interface TasksBoardProps {
  isLoading: boolean;
  systemColumns: TaskColumn[];
  userColumns: TaskColumn[];
  tasks: Task[];
  orphanTasks: Task[];
  onDragEnd: (result: DropResult) => void;
  onAddTask: (columnId?: string) => void;
  onEditTask: (task: Task) => void;
  onAddBoard: () => void;
}

export function TasksBoard({
  isLoading,
  systemColumns,
  userColumns,
  tasks,
  orphanTasks,
  onDragEnd,
  onAddTask,
  onEditTask,
  onAddBoard,
}: TasksBoardProps) {
  const t = useTranslations('Tasks');

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex-1 overflow-hidden pb-4">
        <SkeletonGrid count={3} variant="task-column" />
      </div>
    );
  }

  return (
    <div className="min-h-[500px] flex-1 overflow-hidden pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-6 overflow-hidden">
          {/* Inbox - Fixed left column */}
          <div className="shrink-0">
            <InboxColumn
              tasks={orphanTasks}
              onAddTask={() => onAddTask()}
              onEditTask={onEditTask}
            />
          </div>

          {/* Right side: Workflow + Your boards */}
          <div className="flex flex-1 flex-col gap-6 overflow-y-auto pb-4">
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
                      onAddTask={onAddTask}
                      onEditTask={onEditTask}
                    />
                  );
                })}
              </BoardSection>
            )}

            <BoardSection title={t('section_your_boards')} storageKey="yourBoards">
              {userColumns.map((column) => {
                const columnTasks = tasks
                  .filter((t) => t.columnId === column.id)
                  .sort((a, b) => a.order - b.order);
                return (
                  <TaskBoardColumn
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onAddTask={onAddTask}
                    onEditTask={onEditTask}
                  />
                );
              })}

              <button
                onClick={onAddBoard}
                className="border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground flex h-12 w-80 shrink-0 items-center gap-2 rounded-xl border border-dashed px-4 text-sm font-medium transition-all"
              >
                <Plus className="h-4 w-4" />
                {t('add_board')}
              </button>
            </BoardSection>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
