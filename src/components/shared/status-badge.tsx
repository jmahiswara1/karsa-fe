'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusStyles: Record<Status, { className: string; dot: string }> = {
  TODO: {
    className: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    dot: 'bg-slate-500',
  },
  IN_PROGRESS: {
    className: 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    dot: 'bg-blue-500',
  },
  DONE: {
    className: 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    className: 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
};

const statusKeys: Record<Status, string> = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  DONE: 'done',
  CANCELLED: 'cancelled',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations('Status');
  const style = statusStyles[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold',
        style.className,
        className,
      )}
    >
      <span className={status === 'CANCELLED' ? 'line-through' : ''}>
        {t(statusKeys[status] as 'todo' | 'in_progress' | 'done' | 'cancelled')}
      </span>
    </span>
  );
}
