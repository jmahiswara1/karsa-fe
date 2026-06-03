'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FolderKanban, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { mockProjects } from './mock-data';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="text-primary h-4 w-4" />
          <h2 className="text-foreground text-sm font-semibold">{t('section_projects')}</h2>
        </div>
        <Link
          href="/projects"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs font-medium transition-colors"
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
        {mockProjects.map((project, i) => (
          <motion.div
            key={project.id}
            variants={itemVariants}
            className="group border-border/50 bg-card cursor-pointer rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                {project.title}
              </h3>
              <span className="text-primary text-lg font-bold tabular-nums">
                {project.progress}%
              </span>
            </div>
            <div className="bg-muted/60 mb-2 h-1.5 w-full overflow-hidden rounded-full">
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
            <p className="text-muted-foreground text-[11px] font-medium">
              {project.taskCount} tasks
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
