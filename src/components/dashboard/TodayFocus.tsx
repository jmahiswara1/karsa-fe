'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { PriorityBadge } from '@/components/shared/priority-badge';
import { DeadlineBadge } from '@/components/shared/deadline-badge';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useDashboardSummary } from '@/hooks/use-dashboard';
import { useUpdateTask, type Task, type TaskStatus } from '@/hooks/use-tasks';
import { Skeleton } from '@/components/ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function TodayFocus() {
  const t = useTranslations('Dashboard');
  const { data, isLoading } = useDashboardSummary();
  const updateTask = useUpdateTask();

  const handleToggleStatus = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const statusCycle: Record<TaskStatus, TaskStatus> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'TODO',
      CANCELLED: 'TODO',
    };
    const nextStatus = statusCycle[task.status];
    updateTask.mutate({ id: task.id, status: nextStatus });
  };

  const tasks = data?.todayTasks || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">{t('section_focus')}</h2>
        </div>
        <Link
          href="/tasks"
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          {t('view_all')}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Task list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2.5"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex h-16 items-center gap-3.5 rounded-2xl border border-border/40 bg-card px-5 py-3.5">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))
        ) : tasks.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-border/40 bg-card text-sm text-muted-foreground">
            No focus tasks for today
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              key={task.id}
              variants={itemVariants}
              className="group flex items-center gap-3.5 rounded-2xl border border-border/40 bg-card px-5 py-3.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
            >
              {/* Checkbox circle */}
              <button 
                onClick={(e) => handleToggleStatus(task, e)}
                disabled={updateTask.isPending}
                className="shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
              >
                {task.status === 'DONE' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
                )}
              </button>

              {/* Task title */}
              <span
                className={cn(
                  'flex-1 text-sm truncate transition-colors',
                  task.status === 'DONE'
                    ? 'text-muted-foreground line-through'
                    : 'font-semibold text-foreground group-hover:text-primary',
                )}
              >
                {task.title}
              </span>

              {/* Badges */}
              <div className="flex shrink-0 items-center gap-2">
                <PriorityBadge priority={task.priority} />
                <DeadlineBadge deadline={task.deadline ? new Date(task.deadline) : null} />
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
