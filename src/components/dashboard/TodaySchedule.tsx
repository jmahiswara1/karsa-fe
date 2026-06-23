'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ListChecks, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
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
          <ListChecks className="text-primary h-4.5 w-4.5" />
          <h2 className="text-foreground text-sm font-bold">{t('section_schedule')}</h2>
        </div>
        <Link
          href="/planner"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs font-semibold transition-colors"
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
            <div
              key={i}
              className="border-border/40 bg-card flex h-14 items-center gap-3 rounded-2xl border px-5 py-3"
            >
              <Skeleton className="h-4 w-20" />
              <div className="bg-border/40 h-6 w-[2px] rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))
        ) : schedule.length === 0 ? (
          <div className="border-border/40 bg-card flex h-32 flex-col items-center justify-center gap-3 rounded-2xl border px-5 text-center shadow-sm">
            <div>
              <p className="text-foreground text-sm font-bold">{t('empty_schedule')}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">{t('empty_schedule_desc')}</p>
            </div>
            <Link href="/planner">
              <Button
                size="sm"
                variant="outline"
                className="border-primary/20 hover:bg-primary/5 mt-1 h-8 rounded-full text-xs font-semibold"
              >
                {t('go_to_planner')}
              </Button>
            </Link>
          </div>
        ) : (
          schedule.map(
            (entry: {
              id: string;
              startTime: string;
              endTime: string;
              title: string;
              color?: string;
              isAiGenerated?: boolean;
            }) => (
              <motion.div
                key={entry.id}
                variants={itemVariants}
                className="group border-border/40 bg-card hover:border-primary/20 flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md"
              >
                <div className="text-muted-foreground group-hover:text-primary w-[84px] shrink-0 text-xs font-bold transition-colors">
                  {entry.startTime} <span className="text-muted-foreground/40 font-medium">-</span>{' '}
                  {entry.endTime}
                </div>
                <div
                  className="h-6 w-[3px] rounded-full"
                  style={{ backgroundColor: entry.color || '#e2e8f0' }}
                />
                <div className="text-foreground flex-1 truncate text-sm font-semibold">
                  {entry.title}
                </div>
                {entry.isAiGenerated && (
                  <div className="shrink-0 pl-2">
                    <Sparkles className="text-primary/70 h-3.5 w-3.5" />
                  </div>
                )}
              </motion.div>
            ),
          )
        )}
      </motion.div>
    </motion.div>
  );
}
