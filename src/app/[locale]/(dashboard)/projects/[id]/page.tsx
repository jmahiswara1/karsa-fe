'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Folder, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectDescription } from '@/components/projects/ProjectDescription';
import { ProjectTasksList } from '@/components/projects/ProjectTasksList';
import { ProjectProgress } from '@/components/projects/ProjectProgress';
import { ProjectDetails } from '@/components/projects/ProjectDetails';
import { ProjectDialog } from '@/components/projects/ProjectDialog';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { useProjectQuery, useDeleteProject } from '@/hooks/use-projects';
import { useTasksQuery, type Task } from '@/hooks/use-tasks';
import { useDialogStore } from '@/store/dialog.store';

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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
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
        <Folder className="text-muted-foreground mb-4 h-12 w-12" />
        <h2 className="mb-1 text-xl font-semibold">{t('not_found')}</h2>
        <p className="text-muted-foreground mb-4">{t('not_found_desc')}</p>
        <Button variant="outline" onClick={() => router.push('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('back_to_projects')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProjectHeader
        project={project}
        onBack={() => router.push('/projects')}
        onEdit={() => setEditDialogOpen(true)}
        onDelete={handleDelete}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Description + Tasks */}
        <div className="space-y-6 lg:col-span-2">
          {project.description && <ProjectDescription description={project.description} />}
          <ProjectTasksList
            tasks={tasks}
            onCreateTask={handleCreateTask}
            onEditTask={handleEditTask}
          />
        </div>

        {/* Right: Progress + Details */}
        <div className="space-y-5">
          <ProjectProgress
            progress={project.progress}
            todoCount={todoTasks}
            inProgressCount={inProgressTasks}
            doneCount={doneTasks}
          />
          <ProjectDetails project={project} />
        </div>
      </div>

      {/* Dialogs */}
      <ProjectDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} project={project} />
      <TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} task={editingTask} />
    </div>
  );
}
