/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockTaskSummary, mockTodayTasks } from './mock-data';

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.07,
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  }),
};

const cards = [
  {
    key: 'overdue',
    icon: AlertTriangle,
    numberColor: 'text-rose-500',
    iconColor: 'text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    border: 'border-rose-100 dark:border-rose-900/30',
    getValue: () => mockTaskSummary.overdue,
    labelKey: 'task_summary_overdue',
    unit: 'tugas',
  },
  {
    key: 'today',
    icon: Flame,
    numberColor: 'text-amber-500',
    iconColor: 'text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-100 dark:border-amber-900/30',
    getValue: () => mockTodayTasks.filter((t) => t.status !== 'DONE').length,
    labelKey: 'date_today',
    unit: 'tersisa',
  },
  {
    key: 'done',
    icon: CheckCircle2,
    numberColor: 'text-emerald-500',
    iconColor: 'text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-100 dark:border-emerald-900/30',
    getValue: () => mockTaskSummary.done,
    labelKey: 'task_summary_done',
    unit: 'tugas',
  },
  {
    key: 'progress',
    icon: TrendingUp,
    numberColor: 'text-primary',
    iconColor: 'text-primary/60',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-100 dark:border-blue-900/30',
    getValue: () => mockTaskSummary.inProgress,
    labelKey: 'task_summary_in_progress',
    unit: 'tugas',
  },
] as const;

export function InsightCards() {
  const t = useTranslations('Dashboard');

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const value = card.getValue();
        return (
          <motion.div
            key={card.key}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
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
                {value}
              </span>
            </div>
            {/* Bottom: label + unit */}
            <div className="mt-3">
              <p className="text-foreground text-sm font-semibold">{t(card.labelKey as any)}</p>
              <p className="text-muted-foreground text-[11px]">{card.unit}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
