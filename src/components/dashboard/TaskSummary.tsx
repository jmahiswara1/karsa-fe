/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTranslations } from 'next-intl';
import { AlertTriangle, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardSummary } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export function InsightCards() {
  const t = useTranslations('Dashboard');
  const { data, isLoading } = useDashboardSummary();

  const summary = data?.taskSummary || { total: 0, inProgress: 0, done: 0, overdue: 0 };
  const todayRemaining = data?.todayTasks?.filter((t: any) => t.status !== 'DONE').length || 0;

  const cards = [
    {
      key: 'overdue',
      icon: AlertTriangle,
      numberColor: 'text-rose-500',
      iconColor: 'text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-100 dark:border-rose-900/30',
      value: summary.overdue,
      labelKey: 'task_summary_overdue',
      unitKey: 'unit_tasks',
    },
    {
      key: 'today',
      icon: Flame,
      numberColor: 'text-amber-500',
      iconColor: 'text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-100 dark:border-amber-900/30',
      value: todayRemaining,
      labelKey: 'date_today',
      unitKey: 'unit_tasks',
    },
    {
      key: 'done',
      icon: CheckCircle2,
      numberColor: 'text-emerald-500',
      iconColor: 'text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-100 dark:border-emerald-900/30',
      value: summary.done,
      labelKey: 'task_summary_done',
      unitKey: 'unit_tasks',
    },
    {
      key: 'progress',
      icon: TrendingUp,
      numberColor: 'text-primary',
      iconColor: 'text-primary/60',
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-100 dark:border-blue-900/30',
      value: summary.inProgress,
      labelKey: 'task_summary_in_progress',
      unitKey: 'unit_tasks',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card relative rounded-2xl border p-4">
              <div className="flex items-start justify-between">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-8 w-10" />
              </div>
              <div className="mt-3">
                <Skeleton className="mb-1 h-4 w-16" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          ))
        : cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className={cn(
                  'relative rounded-2xl border p-4 transition-all duration-200',
                  card.bg,
                  card.border,
                )}
              >
                {/* Top row: icon left, number right */}
                <div className="flex items-start justify-between">
                  <Icon className={cn('h-5 w-5', card.iconColor)} />
                  <span
                    className={cn(
                      'text-2xl leading-none font-extrabold tabular-nums',
                      card.numberColor,
                    )}
                  >
                    {card.value}
                  </span>
                </div>
                {/* Bottom: label + unit */}
                <div className="mt-3">
                  <p className="text-foreground text-sm font-bold">{t(card.labelKey as any)}</p>
                  <p className="text-muted-foreground text-[11px]">{t(card.unitKey as any)}</p>
                </div>
              </div>
            );
          })}
    </div>
  );
}
