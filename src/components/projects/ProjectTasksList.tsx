'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useUpdateTask, type Task, type TaskStatus } from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle2, Circle, Plus } from 'lucide-react';

interface ProjectTasksListProps {
  tasks: Task[];
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
}

const statusCycle: Record<TaskStatus, TaskStatus> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: 'TODO',
  CANCELLED: 'TODO',
};

export function ProjectTasksList({ tasks, onCreateTask, onEditTask }: ProjectTasksListProps) {
  const t = useTranslations('Projects');
  const updateTask = useUpdateTask();

  const handleToggleStatus = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus = statusCycle[task.status];
    updateTask.mutate({ id: task.id, status: nextStatus });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="border-border/50 bg-card rounded-xl border"
    >
      <div className="border-border/40 flex items-center justify-between border-b px-5 py-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="text-muted-foreground h-4 w-4" />
          {t('linked_tasks')}{' '}
          <span className="text-muted-foreground font-normal">({tasks.length})</span>
        </h3>
        <Button size="sm" variant="outline" onClick={onCreateTask} className="h-7 gap-1.5 text-xs">
          <Plus className="h-3 w-3" />
          {t('add_task')}
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-muted-foreground text-sm">{t('no_tasks')}</p>
        </div>
      ) : (
        <div className="divide-border/30 divide-y">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="hover:bg-muted/30 flex w-full items-center gap-3 px-5 py-3 transition-colors"
            >
              <button
                onClick={(e) => handleToggleStatus(task, e)}
                disabled={updateTask.isPending}
                className="shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
              >
                {task.status === 'DONE' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/30 hover:text-primary/50 transition-colors" />
                )}
              </button>
              
              <button
                onClick={() => onEditTask(task)}
                className={cn(
                  'flex-1 truncate text-left text-sm font-medium transition-colors hover:text-primary',
                  task.status === 'DONE' && 'text-muted-foreground line-through',
                )}
              >
                {task.title}
              </button>
              
              <span className="text-muted-foreground text-[11px] capitalize shrink-0">
                {task.status.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
