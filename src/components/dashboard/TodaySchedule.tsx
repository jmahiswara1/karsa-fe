'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CalendarClock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useDashboardSummary } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

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

export function TodaySchedule() {
  const t = useTranslations('Dashboard');
  const { data, isLoading } = useDashboardSummary();

  const schedule = data?.todaySchedule || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4.5 w-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">{t('section_schedule')}</h2>
        </div>
        <Link
          href="/planner"
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          {t('view_all')}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Schedule list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2.5"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex h-14 items-center gap-3 rounded-2xl border border-border/40 bg-card px-5 py-3">
              <Skeleton className="h-4 w-20" />
              <div className="w-[2px] h-6 bg-border/40 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))
        ) : schedule.length === 0 ? (
          <div className="flex flex-col h-32 items-center justify-center gap-3 rounded-2xl border border-border/40 bg-card px-5 text-center shadow-sm">
            <div>
              <p className="text-sm font-bold text-foreground">{t('empty_schedule')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t('empty_schedule_desc')}</p>
            </div>
            <Link href="/planner">
              <Button size="sm" variant="outline" className="mt-1 h-8 rounded-full text-xs font-semibold border-primary/20 hover:bg-primary/5">
                {t('go_to_planner')}
              </Button>
            </Link>
          </div>
        ) : (
          schedule.map((entry: any) => (
            <motion.div
              key={entry.id}
              variants={itemVariants}
              className="group flex items-center gap-3 rounded-2xl border border-border/40 bg-card px-4 py-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md hover:border-primary/20"
            >
              <div className="w-[84px] shrink-0 text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                {entry.startTime} <span className="text-muted-foreground/40 font-medium">-</span> {entry.endTime}
              </div>
              <div className="w-[3px] h-6 rounded-full" style={{ backgroundColor: entry.color || '#e2e8f0' }} />
              <div className="flex-1 truncate text-sm font-semibold text-foreground">
                {entry.title}
              </div>
              {entry.isAiGenerated && (
                <div className="shrink-0 pl-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary/70" />
                </div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
