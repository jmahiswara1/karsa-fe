'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { PriorityBadge } from '@/components/shared/priority-badge';
import { StatusBadge } from '@/components/shared/status-badge';
import { DeadlineBadge } from '@/components/shared/deadline-badge';
import { CheckCircle2, Circle, MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useUpdateTask,
  useDeleteTask,
  useTaskColumns,
  columnIdForStatus,
  type Task,
  type TaskStatus,
} from '@/hooks/use-tasks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const statusCycle: Record<TaskStatus, TaskStatus> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: 'TODO',
  CANCELLED: 'TODO',
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const t = useTranslations('Tasks');
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { data: columns } = useTaskColumns();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleStatus = () => {
    const nextStatus = statusCycle[task.status];
    const targetColumnId = columns
      ? (columnIdForStatus(nextStatus, columns) ?? undefined)
      : undefined;
    updateTask.mutate({ id: task.id, status: nextStatus, columnId: targetColumnId });
  };

  const handleDelete = () => {
    deleteTask.mutate(task.id);
    setShowDeleteAlert(false);
  };

  const isToggling = updateTask.isPending;

  return (
    <>
      <motion.div
        variants={itemVariants}
        layout
        className="group border-border/40 bg-card hover:border-primary/20 relative flex items-start gap-4 rounded-2xl border px-5 py-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md"
      >
        {/* Toggle Status Button */}
        <button
          onClick={handleToggleStatus}
          disabled={isToggling}
          className="mt-0.5 shrink-0 transition-transform hover:scale-110 disabled:opacity-50"
        >
          {isToggling ? (
            <Loader2 className="text-primary h-5 w-5 animate-spin" />
          ) : task.status === 'DONE' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : (
            <Circle className="text-muted-foreground/30 group-hover:text-primary/50 h-5 w-5 transition-colors" />
          )}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={cn(
                'text-sm font-semibold transition-colors',
                task.status === 'DONE' ? 'text-muted-foreground line-through' : 'text-foreground',
              )}
            >
              {task.title}
            </h3>
            {/* Actions Menu */}
            <div className="relative shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="hover:bg-muted rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="text-muted-foreground h-4 w-4" />
              </button>
              {showMenu && (
                <div
                  className="border-border bg-popover absolute top-8 right-0 z-50 w-36 rounded-xl border p-1 shadow-lg"
                  onMouseLeave={() => setShowMenu(false)}
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(task);
                    }}
                    className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      setShowDeleteAlert(true);
                    }}
                    className="text-foreground hover:bg-muted flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t('delete')}
                  </button>
                </div>
              )}
            </div>
          </div>

          {task.description && (
            <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{task.description}</p>
          )}

          {/* Badges */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <DeadlineBadge deadline={task.deadline ? new Date(task.deadline) : null} />
            {task.project && (
              <span className="inline-flex items-center rounded-md bg-violet-200 px-2 py-0.5 text-[11px] font-semibold text-violet-800 dark:bg-violet-800 dark:text-violet-200">
                {task.project.title}
              </span>
            )}
            {task.estimate && (
              <span className="inline-flex items-center rounded-md bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {task.estimate < 60
                  ? `${task.estimate}m`
                  : `${Math.floor(task.estimate / 60)}h${task.estimate % 60 > 0 ? ` ${task.estimate % 60}m` : ''}`}
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('delete_confirm_title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('delete_confirm_desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
