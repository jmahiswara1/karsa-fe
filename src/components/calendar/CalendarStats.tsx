'use client';

import { useTranslations } from 'next-intl';
import { Clock, Layers, Sparkles, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PlannerEntry } from '@/hooks/use-planner';

interface CalendarStatsProps {
  entries: PlannerEntry[];
  googleEventCount?: number;
  lastSyncAt?: string | null;
}

function calcPlannedHours(entries: PlannerEntry[]): number {
  let total = 0;
  for (const e of entries) {
    const [sh, sm] = e.startTime.split(':').map(Number);
    const [eh, em] = e.endTime.split(':').map(Number);
    total += (eh * 60 + em - (sh * 60 + sm)) / 60;
  }
  return Math.round(total * 10) / 10;
}

export function CalendarStats({ entries, googleEventCount = 0 }: CalendarStatsProps) {
  const t = useTranslations('Calendar');
  const plannedHours = calcPlannedHours(entries);
  const syncedCount = entries.filter((e) => e.googleEventId).length;

  const stats = [
    { icon: Clock, value: `${plannedHours}h`, label: t('planner_events'), color: 'text-sky-500' },
    { icon: Layers, value: entries.length, label: t('planner_events'), color: 'text-violet-500' },
    { icon: Cloud, value: googleEventCount, label: t('google_events'), color: 'text-emerald-500' },
    {
      icon: Sparkles,
      value: syncedCount,
      label: t('sync_status_connected'),
      color: 'text-amber-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex gap-2 overflow-x-auto pb-1"
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-card ring-border/30 flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 ring-1"
          >
            <Icon className={`h-4 w-4 ${stat.color}`} />
            <div className="flex items-baseline gap-1">
              <span className="text-foreground text-sm font-bold tabular-nums">{stat.value}</span>
              <span className="text-muted-foreground text-[10px] font-medium">{stat.label}</span>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
