'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FolderKanban, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { useDashboardSummary } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const progressColors = [
  'from-primary to-blue-400',
  'from-violet-500 to-purple-400',
  'from-emerald-500 to-teal-400',
];

export function ActiveProjects() {
  const t = useTranslations('Dashboard');
  const { data, isLoading } = useDashboardSummary();

  const projects = data?.activeProjects || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4.5 w-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">{t('section_projects')}</h2>
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          {t('view_all')}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Project cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-3"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/40 bg-card p-5">
              <div className="flex items-start justify-between mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-10" />
              </div>
              <Skeleton className="h-2 w-full rounded-full mb-2" />
              <Skeleton className="h-3 w-24 mt-2" />
            </div>
          ))
        ) : projects.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-border/40 bg-card text-sm text-muted-foreground">
            No active projects
          </div>
        ) : (
          projects.map((project: any, i: number) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group rounded-2xl border border-border/40 bg-card p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <span className="text-lg font-extrabold text-primary tabular-nums leading-none">
                  {project.progress}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ delay: 0.8 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                  className={cn('h-full rounded-full bg-gradient-to-r', progressColors[i % progressColors.length])}
                />
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold mt-2">
                {project.taskCount} tasks remaining
              </p>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
