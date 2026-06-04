'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Folder,
  Pencil,
  Plus,
  Trash2,
  FileText,
  SignalLow,
  SignalMedium,
  SignalHigh,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useProjectQuery, useDeleteProject, type Project, type ProjectStatus, type Priority } from '@/hooks/use-projects';
import { useTasksQuery, type Task } from '@/hooks/use-tasks';
import { ProjectDialog } from '@/components/projects/ProjectDialog';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { useDialogStore } from '@/store/dialog.store';
import { cn } from '@/lib/utils';

const statusConfig: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  PLANNING: { label: 'Planning', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  ACTIVE: { label: 'Active', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  PAUSED: { label: 'Paused', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  COMPLETED: { label: 'Completed', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
  ARCHIVED: { label: 'Archived', color: 'text-gray-500', bg: 'bg-gray-500/10 border-gray-500/20' },
};

const priorityConfig: Record<Priority, { icon: React.ReactNode; label: string; color: string }> = {
  LOW: { icon: <SignalLow className="h-4 w-4" />, label: 'Low', color: 'text-blue-500' },
  MEDIUM: { icon: <SignalMedium className="h-4 w-4" />, label: 'Medium', color: 'text-yellow-500' },
  HIGH: { icon: <SignalHigh className="h-4 w-4" />, label: 'High', color: 'text-orange-500' },
  URGENT: { icon: <AlertCircle className="h-4 w-4" />, label: 'Urgent', color: 'text-red-500' },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('Projects');
  const { showConfirm } = useDialogStore();
  const deleteProject = useDeleteProject();

  const projectId = params.id as string;
  const { data: project, isLoading } = useProjectQuery(projectId);
  const { data: tasksData } = useTasksQuery({ projectId, limit: 1000 });

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tasks = tasksData?.data || [];
  const doneTasks = tasks.filter((t) => t.status === 'DONE').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const todoTasks = tasks.filter((t) => t.status === 'TODO').length;

  const handleDelete = () => {
    if (!project) return;
    showConfirm({
      title: t('delete_confirm_title'),
      description: t('delete_confirm_desc'),
      confirmText: t('delete_confirm_yes'),
      onConfirm: async () => {
        await deleteProject.mutateAsync(project.id);
        router.push('/projects');
      },
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-60 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Folder className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-1">{t('not_found')}</h2>
        <p className="text-muted-foreground mb-4">{t('not_found_desc')}</p>
        <Button variant="outline" onClick={() => router.push('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('back_to_projects')}
        </Button>
      </div>
    );
  }

  const status = statusConfig[project.status];
  const prio = priorityConfig[project.priority];
  const deadlineStr = project.deadline
    ? new Date(project.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;
  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'COMPLETED';

  return (
    <div className="space-y-6">
      {/* Back + Title */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/projects')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg border", status.bg)}>
            <Folder className={cn("h-4.5 w-4.5", status.color)} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">{project.title}</h1>
            <span className={cn("text-xs font-medium", status.color)}>{t(`status_${project.status.toLowerCase()}`)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" />
            {t('edit')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDelete} className="gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
            <Trash2 className="h-3.5 w-3.5" />
            {t('delete')}
          </Button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Description + Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {project.description && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="rounded-xl border border-border/50 bg-card p-5"
            >
              <h3 className="text-sm font-semibold mb-2">{t('description')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </motion.div>
          )}

          {/* Tasks List */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-xl border border-border/50 bg-card"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                {t('linked_tasks')} <span className="text-muted-foreground font-normal">({tasks.length})</span>
              </h3>
              <Button size="sm" variant="outline" onClick={handleCreateTask} className="gap-1.5 h-7 text-xs">
                <Plus className="h-3 w-3" />
                {t('add_task')}
              </Button>
            </div>

            {tasks.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm text-muted-foreground">{t('no_tasks')}</p>
              </div>
            ) : (
              <div className="divide-y divide-border/30">
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleEditTask(task)}
                    className="flex items-center gap-3 px-5 py-3 w-full text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      task.status === 'DONE' ? 'bg-emerald-500' : task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-muted-foreground/40'
                    )} />
                    <span className={cn("text-sm flex-1 truncate", task.status === 'DONE' && "line-through text-muted-foreground")}>
                      {task.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {task.status.toLowerCase().replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right: Sidebar Properties */}
        <div className="space-y-5">
          {/* Progress Card */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="rounded-xl border border-border/50 bg-card p-5"
          >
            <h3 className="text-sm font-semibold mb-4">{t('progress')}</h3>

            <div className="flex items-center justify-center mb-4">
              <div className="relative h-24 w-24">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/30" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="currentColor" strokeWidth="8"
                    strokeDasharray={`${project.progress * 2.64} 264`}
                    strokeLinecap="round"
                    className={cn(project.progress >= 100 ? 'text-emerald-500' : 'text-primary')}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold">{project.progress}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/30 py-2">
                <div className="text-lg font-bold">{todoTasks}</div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">To Do</div>
              </div>
              <div className="rounded-lg bg-blue-500/10 py-2">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{inProgressTasks}</div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Active</div>
              </div>
              <div className="rounded-lg bg-emerald-500/10 py-2">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{doneTasks}</div>
                <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Done</div>
              </div>
            </div>
          </motion.div>

          {/* Details Card */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-xl border border-border/50 bg-card p-5"
          >
            <h3 className="text-sm font-semibold mb-3">{t('details')}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t('field_priority')}</span>
                <div className={cn("flex items-center gap-1.5 text-xs font-medium", prio.color)}>
                  {prio.icon}
                  {t(`priority_${project.priority.toLowerCase()}`)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t('field_deadline')}</span>
                <span className={cn("text-xs font-medium", isOverdue ? 'text-red-500' : 'text-foreground')}>
                  {deadlineStr || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t('created')}</span>
                <span className="text-xs font-medium">
                  {new Date(project.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dialogs */}
      <ProjectDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} project={project} />
      <TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} task={editingTask} />
    </div>
  );
}
