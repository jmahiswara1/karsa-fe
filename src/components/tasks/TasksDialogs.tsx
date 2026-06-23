'use client';

import { TaskDialog } from './TaskDialog';
import { CreateBoardDialog } from './CreateBoardDialog';
import type { Task } from '@/hooks/use-tasks';

interface TasksDialogsProps {
  dialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  editingTask: Task | null;
  defaultColumnId: string | undefined;
  createBoardOpen: boolean;
  onCreateBoardOpenChange: (open: boolean) => void;
}

export function TasksDialogs({
  dialogOpen,
  onDialogOpenChange,
  editingTask,
  defaultColumnId,
  createBoardOpen,
  onCreateBoardOpenChange,
}: TasksDialogsProps) {
  return (
    <>
      <TaskDialog
        open={dialogOpen}
        onOpenChange={onDialogOpenChange}
        task={editingTask}
        defaultColumnId={defaultColumnId}
      />
      <CreateBoardDialog open={createBoardOpen} onOpenChange={onCreateBoardOpenChange} />
    </>
  );
}
