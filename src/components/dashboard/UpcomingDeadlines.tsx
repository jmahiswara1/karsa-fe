'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { DeadlineBadge } from '@/components/shared/deadline-badge';
import { Clock, FolderOpen, CheckSquare2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDashboardSummary } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.4 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function UpcomingDeadlines() {
  const t = useTranslations('Dashboard');
  const { data, isLoading } = useDashboardSummary();

  const deadlines = data?.upcomingDeadlines || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4.5 w-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">{t('section_timeline')}</h2>
        </div>
      </div>

      {/* Deadline list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2.5"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex h-[64px] items-center gap-3.5 rounded-2xl border border-border/40 bg-card px-5">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-20 ml-auto" />
            </div>
          ))
        ) : deadlines.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-2xl border border-border/40 bg-card text-sm text-muted-foreground">
            No upcoming deadlines
          </div>
        ) : (
          deadlines.map((item: any) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group flex items-center gap-3.5 rounded-2xl border border-border/40 bg-card px-5 py-3.5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all hover:shadow-md hover:border-primary/20 cursor-pointer"
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all',
                  item.type === 'project'
                    ? 'bg-violet-50 dark:bg-violet-950/30 group-hover:bg-violet-100 group-hover:scale-110'
                    : 'bg-primary/5 dark:bg-primary/10 group-hover:bg-primary/10 group-hover:scale-110',
                )}
              >
                {item.type === 'project' ? (
                  <FolderOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                ) : (
                  <CheckSquare2 className="h-4 w-4 text-primary" />
                )}
              </div>
              <span className="flex-1 truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                {item.title}
              </span>
              <DeadlineBadge deadline={item.deadline ? new Date(item.deadline) : null} className="shrink-0 scale-105" />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
