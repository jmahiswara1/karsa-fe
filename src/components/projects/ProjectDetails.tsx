'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { SignalLow, SignalMedium, SignalHigh, AlertCircle } from 'lucide-react';
import type { Project, Priority } from '@/hooks/use-projects';
import { cn } from '@/lib/utils';

const priorityConfig: Record<Priority, { icon: React.ReactNode; color: string }> = {
  LOW: { icon: <SignalLow className="h-4 w-4" />, color: 'text-blue-500' },
  MEDIUM: { icon: <SignalMedium className="h-4 w-4" />, color: 'text-yellow-500' },
  HIGH: { icon: <SignalHigh className="h-4 w-4" />, color: 'text-orange-500' },
  URGENT: { icon: <AlertCircle className="h-4 w-4" />, color: 'text-red-500' },
};

interface ProjectDetailsProps {
  project: Project;
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const t = useTranslations('Projects');
  const prio = priorityConfig[project.priority];
  const deadlineStr = project.deadline
    ? new Date(project.deadline).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;
  const isOverdue =
    project.deadline && new Date(project.deadline) < new Date() && project.status !== 'COMPLETED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="border-border/50 bg-card rounded-xl border p-5"
    >
      <h3 className="mb-3 text-sm font-semibold">{t('details')}</h3>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{t('field_priority')}</span>
          <div className={cn('flex items-center gap-1.5 text-xs font-medium', prio.color)}>
            {prio.icon}
            {t(`priority_${project.priority.toLowerCase()}`)}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{t('field_deadline')}</span>
          <span
            className={cn('text-xs font-medium', isOverdue ? 'text-red-500' : 'text-foreground')}
          >
            {deadlineStr || '—'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">{t('created')}</span>
          <span className="text-xs font-medium">
            {new Date(project.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
