'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Task } from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';

interface ProjectTasksListProps {
  tasks: Task[];
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
}

export function ProjectTasksList({ tasks, onCreateTask, onEditTask }: ProjectTasksListProps) {
  const t = useTranslations('Projects');

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
            <button
              key={task.id}
              onClick={() => onEditTask(task)}
              className="hover:bg-muted/30 flex w-full items-center gap-3 px-5 py-3 text-left transition-colors"
            >
              <div
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  task.status === 'DONE'
                    ? 'bg-emerald-500'
                    : task.status === 'IN_PROGRESS'
                      ? 'bg-blue-500'
                      : 'bg-muted-foreground/40',
                )}
              />
              <span
                className={cn(
                  'flex-1 truncate text-sm',
                  task.status === 'DONE' && 'text-muted-foreground line-through',
                )}
              >
                {task.title}
              </span>
              <span className="text-muted-foreground text-[11px] capitalize">
                {task.status.toLowerCase().replace('_', ' ')}
              </span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
