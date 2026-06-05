'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, Folder, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Project, ProjectStatus } from '@/hooks/use-projects';
import { cn } from '@/lib/utils';

const statusConfig: Record<ProjectStatus, { color: string; bg: string }> = {
  PLANNING: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  ACTIVE: {
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  PAUSED: {
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
  },
  COMPLETED: {
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/20',
  },
  ARCHIVED: { color: 'text-gray-500', bg: 'bg-gray-500/10 border-gray-500/20' },
};

interface ProjectHeaderProps {
  project: Project;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectHeader({ project, onBack, onEdit, onDelete }: ProjectHeaderProps) {
  const t = useTranslations('Projects');
  const status = statusConfig[project.status] || statusConfig.PLANNING;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div
          className={cn('flex h-9 w-9 items-center justify-center rounded-lg border', status.bg)}
        >
          <Folder className={cn('h-4.5 w-4.5', status.color)} />
        </div>
        <div>
          <h1 className="text-xl leading-tight font-bold">{project.title}</h1>
          <span className={cn('text-xs font-medium', status.color)}>
            {t(`status_${project.status.toLowerCase()}`)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          {t('edit')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="gap-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t('delete')}
        </Button>
      </div>
    </motion.div>
  );
}
