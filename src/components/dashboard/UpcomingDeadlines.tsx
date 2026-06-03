'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { DeadlineBadge } from '@/components/shared/deadline-badge';
import { Clock, FolderOpen, CheckSquare2 } from 'lucide-react';
// No Link import needed
import { cn } from '@/lib/utils';
import { mockDeadlines } from './mock-data';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.4 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export function UpcomingDeadlines() {
  const t = useTranslations('Dashboard');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="text-primary h-4 w-4" />
          <h2 className="text-foreground text-sm font-semibold">{t('section_timeline')}</h2>
        </div>
      </div>

      {/* Deadline list */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="border-border/50 bg-card divide-border/30 divide-y overflow-hidden rounded-xl border shadow-sm"
      >
        {mockDeadlines.slice(0, 4).map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="group hover:bg-muted/30 flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors"
          >
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                item.type === 'project'
                  ? 'bg-violet-100 group-hover:bg-violet-200 dark:bg-violet-950/30 dark:group-hover:bg-violet-900/40'
                  : 'bg-primary/8 dark:bg-primary/15 group-hover:bg-primary/15 dark:group-hover:bg-primary/25',
              )}
            >
              {item.type === 'project' ? (
                <FolderOpen className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
              ) : (
                <CheckSquare2 className="text-primary h-3.5 w-3.5" />
              )}
            </div>
            <span className="text-foreground group-hover:text-primary flex-1 truncate text-sm font-medium transition-colors">
              {item.title}
            </span>
            <DeadlineBadge deadline={item.deadline} className="shrink-0" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
