'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityStyles: Record<Priority, { className: string; dot: string }> = {
  LOW: {
    className: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    dot: 'bg-slate-500',
  },
  MEDIUM: {
    className: 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200',
    dot: 'bg-amber-500',
  },
  HIGH: {
    className: 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200',
    dot: 'bg-orange-600',
  },
  URGENT: {
    className: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200',
    dot: 'bg-red-600',
  },
};

const priorityKeys: Record<Priority, string> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const t = useTranslations('Priority');
  const style = priorityStyles[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold',
        style.className,
        className,
      )}
    >
      {t(priorityKeys[priority] as 'low' | 'medium' | 'high' | 'urgent')}
    </span>
  );
}
