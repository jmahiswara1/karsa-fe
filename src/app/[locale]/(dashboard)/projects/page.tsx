'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Plus, FolderOpen } from 'lucide-react';
import { PageIntro } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { SkeletonGrid } from '@/components/shared/SkeletonGrid';
import { EmptyState } from '@/components/shared/empty-state';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectDialog } from '@/components/projects/ProjectDialog';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import {
  useProjectsQuery,
  useDeleteProject,
  type Project,
  type ProjectStatus,
  type Priority,
} from '@/hooks/use-projects';
import { usePageFilters } from '@/hooks/use-page-filters';
import { useDeleteConfirm } from '@/hooks/use-delete-confirm';

export default function ProjectsPage() {
  const t = useTranslations('Projects');
  const tPages = useTranslations('Pages');
  const router = useRouter();
  const { confirmDelete } = useDeleteConfirm();
  const deleteProject = useDeleteProject();

  const filters = usePageFilters<ProjectStatus, Priority>({ limit: 100 });
  const { data, isLoading } = useProjectsQuery(
    filters.queryParams as Parameters<typeof useProjectsQuery>[0],
  );
  const projects = data?.data || [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleCreateProject = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    confirmDelete(
      async () => {
        await deleteProject.mutateAsync(project.id);
      },
      {
        title: t('delete_confirm_title'),
        description: t('delete_confirm_desc'),
        confirmText: t('delete_confirm_yes'),
      },
    );
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="flex h-full flex-col space-y-6 pb-2">
      <PageIntro title={tPages('projects_title')} subtitle={tPages('projects_desc')} />

      <ProjectFilters
        search={filters.search}
        onSearchChange={filters.onSearchChange}
        status={filters.status}
        onStatusChange={filters.setStatus}
        priority={filters.priority}
        onPriorityChange={filters.setPriority}
        onClear={filters.clear}
        action={
          <Button onClick={handleCreateProject} size="sm" className="h-9 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            {t('create_project')}
          </Button>
        }
      />

      {isLoading ? (
        <SkeletonGrid count={6} variant="project" />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={filters.hasFilters ? t('no_results') : t('no_projects')}
          description={filters.hasFilters ? t('no_results_desc') : t('no_projects_desc')}
          action={
            !filters.hasFilters ? (
              <Button onClick={handleCreateProject} size="sm" className="mt-4 gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                {t('create_project')}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      )}

      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={editingProject} />
    </div>
  );
}
