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
          <FolderKanban className="text-primary h-4.5 w-4.5" />
          <h2 className="text-foreground text-sm font-bold">{t('section_projects')}</h2>
        </div>
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs font-semibold transition-colors"
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
            <div key={i} className="border-border/40 bg-card rounded-2xl border p-5">
              <div className="mb-4 flex items-start justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-10" />
              </div>
              <Skeleton className="mb-2 h-2 w-full rounded-full" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
          ))
        ) : projects.length === 0 ? (
          <div className="border-border/40 bg-card text-muted-foreground flex h-32 items-center justify-center rounded-2xl border text-sm">
            No active projects
          </div>
        ) : (
          projects.map(
            (
              project: {
                id: string;
                title: string;
                progress: number;
                color: string;
                taskCount: number;
              },
              i: number,
            ) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="group border-border/40 bg-card hover:border-primary/20 cursor-pointer rounded-2xl border p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-foreground group-hover:text-primary text-sm font-bold transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-primary text-lg leading-none font-extrabold tabular-nums">
                    {project.progress}%
                  </span>
                </div>
                <div className="bg-muted/60 mb-2 h-2 w-full overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ delay: 0.8 + i * 0.15, duration: 0.8, ease: 'easeOut' }}
                    className={cn(
                      'h-full rounded-full bg-gradient-to-r',
                      progressColors[i % progressColors.length],
                    )}
                  />
                </div>
                <p className="text-muted-foreground mt-2 text-[11px] font-semibold">
                  {project.taskCount} tasks remaining
                </p>
              </motion.div>
            ),
          )
        )}
      </motion.div>
    </motion.div>
  );
}
