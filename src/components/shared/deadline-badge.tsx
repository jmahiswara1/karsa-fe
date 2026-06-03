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
        className={cn('text-muted-foreground inline-flex items-center gap-1 text-xs', className)}
      >
        <CalendarClock className="h-3 w-3" />
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
      'bg-red-50 text-red-700 ring-red-200 animate-pulse ring-1 ring-inset rounded-full px-2.5 py-0.5';
  } else if (days === 0) {
    label = t('due_today');
    className2 =
      'bg-amber-50 text-amber-700 ring-amber-200 ring-1 ring-inset rounded-full px-2.5 py-0.5';
  } else if (days === 1) {
    label = t('due_tomorrow');
    className2 =
      'bg-orange-50 text-orange-700 ring-orange-200 ring-1 ring-inset rounded-full px-2.5 py-0.5';
  } else {
    const dateStr = new Date(deadline).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    label = dateStr;
    className2 =
      'bg-slate-50 text-slate-600 ring-slate-200 ring-1 ring-inset rounded-full px-2.5 py-0.5';
  }

  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs font-medium', className2, className)}
    >
      <CalendarClock className="h-3 w-3" />
      {label}
    </span>
  );
}
