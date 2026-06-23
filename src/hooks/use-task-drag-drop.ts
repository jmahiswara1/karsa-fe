'use client';

import { useQueryClient } from '@tanstack/react-query';
import type { DropResult } from '@hello-pangea/dnd';
import {
  useReorderTasks,
  type Task,
  type TaskColumn,
  type TaskStatus,
  type TasksResponse,
} from './use-tasks';
import { INBOX_DROPPABLE_ID } from '@/components/tasks/InboxColumn';

interface UseTaskDragDropArgs {
  tasks: Task[];
  columns: TaskColumn[];
  queryParams: Record<string, unknown>;
}

interface UseTaskDragDropResult {
  onDragEnd: (result: DropResult) => void;
}

/**
 * Drag-and-drop handler for the tasks board.
 * Resolves destination column → status, applies an optimistic query cache
 * update, and persists the new order via `useReorderTasks`.
 */
export function useTaskDragDrop({
  tasks,
  columns,
  queryParams,
}: UseTaskDragDropArgs): UseTaskDragDropResult {
  const queryClient = useQueryClient();
  const reorderTasks = useReorderTasks();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    const destColumnId =
      destination.droppableId === INBOX_DROPPABLE_ID ? null : destination.droppableId;

    const newTasks = Array.from(tasks);
    const [movedTask] = newTasks.splice(
      newTasks.findIndex((t) => t.id === draggableId),
      1,
    );

    const destColumn = columns.find((c) => c.id === destination.droppableId);
    let newStatus: TaskStatus = movedTask.status;
    if (destColumn) {
      const colName = destColumn.name.toLowerCase();
      if (colName.includes('todo') || colName.includes('to do') || colName.includes('to-do')) {
        newStatus = 'TODO';
      } else if (
        colName.includes('progress') ||
        colName.includes('doing') ||
        colName.includes('active')
      ) {
        newStatus = 'IN_PROGRESS';
      } else if (
        colName.includes('done') ||
        colName.includes('complete') ||
        colName.includes('finish')
      ) {
        newStatus = 'DONE';
      }
    }

    movedTask.columnId = destColumnId;
    movedTask.status = newStatus;

    const destTasks = newTasks
      .filter((t) => {
        if (destColumnId === null) return !t.columnId;
        return t.columnId === destColumnId;
      })
      .sort((a, b) => a.order - b.order);

    destTasks.splice(destination.index, 0, movedTask);

    const updates = destTasks.map((t, index) => {
      t.order = index * 1000;
      return {
        id: t.id,
        order: t.order,
        columnId: t.columnId ?? null,
        ...(t.id === movedTask.id ? { status: newStatus } : {}),
      };
    });

    queryClient.setQueryData(['tasks', queryParams], (old: TasksResponse | undefined) => {
      if (!old) return old;
      const updatedData = old.data.map((t: Task) => {
        const update = updates.find((u) => u.id === t.id);
        if (update) {
          return {
            ...t,
            order: update.order,
            columnId: update.columnId,
            ...(update.status ? { status: update.status } : {}),
          };
        }
        return t;
      });
      return { ...old, data: updatedData };
    });

    reorderTasks.mutate(updates);
  };

  return { onDragEnd };
}
