'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { PriorityBadge } from '@/components/shared/priority-badge';
import { DeadlineBadge } from '@/components/shared/deadline-badge';
import { CheckCircle2, Circle, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import {
  useTodayTasks,
  useUpdateTask,
  useTaskColumns,
  columnIdForStatus,
  type TaskStatus,
  type Task,
} from '@/hooks/use-tasks';
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
  const router = useRouter();
  const { data, isLoading, isError } = useTodayTasks();
  const { data: columnsData } = useTaskColumns();
  const updateTask = useUpdateTask();

  const tasks = data?.data || [];
  const columns = columnsData || [];
  const isEmpty = !isLoading && (isError || tasks.length === 0);

  const formatEstimate = (minutes: number | null) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const handleToggleStatus = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const statusCycle: Record<TaskStatus, TaskStatus> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'TODO',
      CANCELLED: 'TODO',
    };
    const nextStatus = statusCycle[task.status];
    const targetColumnId = columnIdForStatus(nextStatus, columns);
    updateTask.mutate({
      id: task.id,
      status: nextStatus,
      ...(targetColumnId && { columnId: targetColumnId }),
    });
  };

  const handleTaskClick = () => {
    router.push('/tasks');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-4.5 w-4.5" />
          <h2 className="text-foreground text-sm font-bold">{t('section_focus')}</h2>
        </div>
        <Link
          href="/tasks"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs font-semibold transition-colors"
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
            <div
              key={i}
              className="border-border/40 bg-card flex h-16 items-center gap-3.5 rounded-2xl border px-5 py-3.5"
            >
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))
        ) : isEmpty ? (
          <div className="border-border/40 bg-card text-muted-foreground flex h-32 items-center justify-center rounded-2xl border text-sm">
            {t('no_focus_tasks')}
          </div>
        ) : (
          tasks.map((task) => {
            const columnName = task.column?.name ?? null;
            const estimate = formatEstimate(task.estimate);

            return (
              <motion.div
                key={task.id}
                variants={itemVariants}
                onClick={handleTaskClick}
                className="group border-border/40 bg-card hover:border-primary/20 flex cursor-pointer items-center gap-3.5 rounded-2xl border px-5 py-3.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md"
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
                    <Circle className="text-muted-foreground/30 group-hover:text-primary/50 h-5 w-5 transition-colors" />
                  )}
                </button>

                {/* Task content */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span
                    className={cn(
                      'truncate text-sm transition-colors',
                      task.status === 'DONE'
                        ? 'text-muted-foreground line-through'
                        : 'text-foreground group-hover:text-primary font-semibold',
                    )}
                  >
                    {task.title}
                  </span>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {columnName && (
                      <span className="inline-flex items-center rounded-md bg-blue-200 px-2 py-0.5 text-[11px] font-semibold text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                        {columnName}
                      </span>
                    )}
                    <PriorityBadge priority={task.priority} />
                    <DeadlineBadge deadline={task.deadline ? new Date(task.deadline) : null} />
                    {task.project?.title && (
                      <span className="inline-flex items-center rounded-md bg-violet-200 px-2 py-0.5 text-[11px] font-semibold text-violet-800 dark:bg-violet-800 dark:text-violet-200">
                        {task.project.title}
                      </span>
                    )}
                    {estimate && (
                      <span className="inline-flex items-center rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        {estimate}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </motion.div>
  );
}
