'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { PriorityBadge } from '@/components/shared/priority-badge';
import { DeadlineBadge } from '@/components/shared/deadline-badge';
import { CheckCircle2, Circle, ArrowRight, ListChecks } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { mockTodayTasks } from './mock-data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function TodayFocus() {
  const t = useTranslations('Dashboard');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="text-primary h-4 w-4" />
          <h2 className="text-foreground text-sm font-semibold">{t('section_focus')}</h2>
        </div>
        <Link
          href="/tasks"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs font-medium transition-colors"
        >
          {t('view_all')}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Task list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="border-border/50 bg-card divide-border/30 divide-y overflow-hidden rounded-xl border shadow-sm"
      >
        {mockTodayTasks.map((task) => (
          <motion.div
            key={task.id}
            variants={itemVariants}
            className="group hover:bg-muted/30 flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors"
          >
            {/* Checkbox circle */}
            <button className="shrink-0 transition-transform hover:scale-110">
              {task.status === 'DONE' ? (
                <CheckCircle2 className="h-[18px] w-[18px] text-emerald-500" />
              ) : (
                <Circle className="text-muted-foreground/30 group-hover:text-primary/60 h-[18px] w-[18px] transition-colors" />
              )}
            </button>

            {/* Task title */}
            <span
              className={cn(
                'flex-1 truncate text-sm transition-colors',
                task.status === 'DONE'
                  ? 'text-muted-foreground line-through'
                  : 'text-foreground group-hover:text-primary font-medium',
              )}
            >
              {task.title}
            </span>

            {/* Badges */}
            <div className="flex shrink-0 items-center gap-1.5 opacity-70 transition-opacity group-hover:opacity-100">
              <PriorityBadge priority={task.priority} />
              <DeadlineBadge deadline={task.deadline} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
