'use client';

import { useTranslations } from 'next-intl';
import { Draggable } from '@hello-pangea/dnd';
import { PriorityBadge } from '@/components/shared/priority-badge';
import { DeadlineBadge } from '@/components/shared/deadline-badge';
import { cn } from '@/lib/utils';
import type { Task } from '@/hooks/use-tasks';
import { GripVertical, FolderOpen, AlignLeft, CheckCircle2 } from 'lucide-react';

interface TaskBoardCardProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
  isDone?: boolean;
}

export function TaskBoardCard({ task, index, onEdit, isDone }: TaskBoardCardProps) {
  const t = useTranslations('Tasks');

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onEdit(task)}
          className={cn(
            'group relative flex flex-col gap-2 rounded-md border bg-card p-3 shadow-sm transition-colors mb-2 cursor-pointer hover:border-border/80 hover:bg-muted/30',
            snapshot.isDragging ? 'opacity-90 ring-2 ring-primary/50 z-50 rotate-2' : 'border-border/40'
          )}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex items-start gap-2">
            {isDone && (
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-emerald-500" />
            )}
            <h4 className={cn("text-sm font-medium leading-tight", isDone && "text-muted-foreground")}>
              {task.title}
            </h4>
          </div>

          <div className="flex items-center gap-3 mt-1 text-muted-foreground/60">
            {task.description && (
              <AlignLeft className="h-3.5 w-3.5" />
            )}
            
            {/* Keeping the priority and deadline badges for utility, though screenshot hides them.
                We can show them minimally if they exist. */}
            {task.priority && task.priority !== 'MEDIUM' && (
              <div className="scale-75 origin-left opacity-60">
                <PriorityBadge priority={task.priority} />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
