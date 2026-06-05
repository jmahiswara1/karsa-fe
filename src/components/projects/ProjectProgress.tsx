'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProjectProgressProps {
  progress: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}

export function ProjectProgress({
  progress,
  todoCount,
  inProgressCount,
  doneCount,
}: ProjectProgressProps) {
  const t = useTranslations('Projects');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="border-border/50 bg-card rounded-xl border p-5"
    >
      <h3 className="mb-4 text-sm font-semibold">{t('progress')}</h3>

      <div className="mb-4 flex items-center justify-center">
        <div className="relative h-24 w-24">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${progress * 2.64} 264`}
              strokeLinecap="round"
              className={cn(progress >= 100 ? 'text-emerald-500' : 'text-primary')}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-muted/30 rounded-lg py-2">
          <div className="text-lg font-bold">{todoCount}</div>
          <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            To Do
          </div>
        </div>
        <div className="rounded-lg bg-blue-500/10 py-2">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {inProgressCount}
          </div>
          <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            Active
          </div>
        </div>
        <div className="rounded-lg bg-emerald-500/10 py-2">
          <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {doneCount}
          </div>
          <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
            Done
          </div>
        </div>
      </div>
    </motion.div>
  );
}
