'use client';

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { CalendarClock } from 'lucide-react';

interface DeadlineBadgeProps {
  deadline: Date | string | null | undefined;
  className?: string;
}

function getDaysUntil(deadline: Date | string): number {
  const target = new Date(deadline);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function DeadlineBadge({ deadline, className }: DeadlineBadgeProps) {
  const t = useTranslations('Dashboard');

  if (!deadline) {
    return (
      <span
        className={cn(
          'text-muted-foreground inline-flex items-center rounded-md text-[11px] font-semibold',
          className,
        )}
      >
        {t('no_deadline')}
      </span>
    );
  }

  const days = getDaysUntil(deadline);

  let label = '';
  let className2 = '';

  if (days < 0) {
    label = t('overdue');
    className2 =
      'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200 animate-pulse rounded-md px-2 py-0.5';
  } else if (days === 0) {
    label = t('due_today');
    className2 =
      'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200 rounded-md px-2 py-0.5';
  } else if (days === 1) {
    label = t('due_tomorrow');
    className2 =
      'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200 rounded-md px-2 py-0.5';
  } else {
    const dateStr = new Date(deadline).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    label = dateStr;
    className2 =
      'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 rounded-md px-2 py-0.5';
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md text-[11px] font-semibold',
        className2,
        className,
      )}
    >
      <CalendarClock className="h-3 w-3" />
      {label}
    </span>
  );
}
