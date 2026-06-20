'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Folder, MoreHorizontal, Trash2, Pencil, SignalLow, SignalMedium, SignalHigh, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project, ProjectStatus, Priority } from '@/hooks/use-projects';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProjectCardProps {
  project: Project;
  index: number;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onClick: (project: Project) => void;
}

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  PLANNING: { label: 'Planning', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  ACTIVE: { label: 'Active', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  PAUSED: { label: 'Paused', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  COMPLETED: { label: 'Completed', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10' },
  ARCHIVED: { label: 'Archived', color: 'text-gray-500 dark:text-gray-500', bg: 'bg-gray-500/10' },
};

const priorityIcon: Record<Priority, React.ReactNode> = {
  LOW: <SignalLow className="h-3.5 w-3.5 text-blue-500" />,
  MEDIUM: <SignalMedium className="h-3.5 w-3.5 text-yellow-500" />,
  HIGH: <SignalHigh className="h-3.5 w-3.5 text-orange-500" />,
  URGENT: <AlertCircle className="h-3.5 w-3.5 text-red-500" />,
};

export function ProjectCard({ project, index, onEdit, onDelete, onClick }: ProjectCardProps) {
  const t = useTranslations('Projects');
  const status = statusConfig[project.status] || statusConfig.PLANNING;
  const taskCount = project._count?.tasks ?? 0;
  const deadlineStr = project.deadline
    ? new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : null;

  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'COMPLETED' && project.status !== 'ARCHIVED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <div
        onClick={() => onClick(project)}
        className={cn(
          "group relative flex flex-col rounded-xl border border-border/50 bg-card p-5 cursor-pointer transition-all duration-200",
          "hover:border-border hover:shadow-md hover:-translate-y-0.5",
          project.status === 'ARCHIVED' && "opacity-60"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shrink-0", status.bg)}>
              <Folder className={cn("h-4 w-4", status.color)} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold leading-tight truncate">{project.title}</h3>
              <span className={cn("text-[11px] font-medium", status.color)}>
                {t(`status_${project.status.toLowerCase()}`)}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(project); }}>
                <Pencil className="h-3.5 w-3.5 mr-2" />
                {t('edit')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(project); }} className="text-foreground focus:text-foreground">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>
        )}

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">{t('progress')}</span>
            <span className="text-[11px] font-semibold">{project.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                project.progress >= 100 ? "bg-emerald-500" : project.progress >= 50 ? "bg-primary" : "bg-primary/70"
              )}
              style={{ width: `${Math.min(project.progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-[11px]">
              <CheckCircle2 className="h-3 w-3" />
              <span>{taskCount} {t('tasks')}</span>
            </div>
            {deadlineStr && (
              <div className={cn("flex items-center gap-1 text-[11px]", isOverdue && "text-red-500")}>
                <Calendar className="h-3 w-3" />
                <span>{deadlineStr}</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {priorityIcon[project.priority]}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
