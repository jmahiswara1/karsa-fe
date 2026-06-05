'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Plus, FolderOpen } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useDialogStore } from '@/store/dialog.store';

export default function ProjectsPage() {
  const t = useTranslations('Projects');
  const tPages = useTranslations('Pages');
  const router = useRouter();
  const { showConfirm } = useDialogStore();
  const deleteProject = useDeleteProject();

  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<ProjectStatus | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');

  // Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => setDebouncedSearch(value), 500);
    return () => clearTimeout(timeout);
  }, []);

  const queryParams = useMemo(
    () => ({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(status && { status }),
      ...(priority && { priority }),
      limit: 100,
    }),
    [debouncedSearch, status, priority],
  );

  const { data, isLoading } = useProjectsQuery(queryParams);
  const projects = data?.data || [];

  const handleCreateProject = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    showConfirm({
      title: t('delete_confirm_title'),
      description: t('delete_confirm_desc'),
      confirmText: t('delete_confirm_yes'),
      onConfirm: async () => {
        await deleteProject.mutateAsync(project.id);
      },
    });
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('');
    setPriority('');
  };

  const hasFilters = !!search || !!status || !!priority;

  return (
    <div className="flex h-full flex-col space-y-6 pb-2">
      {/* Header */}
      <PageHeader
        title={tPages('projects_title')}
        description={tPages('projects_desc')}
        actions={
          <Button onClick={handleCreateProject} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('create_project')}
          </Button>
        }
      />

      {/* Filters */}
      <ProjectFilters
        search={search}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={setStatus}
        priority={priority}
        onPriorityChange={setPriority}
        onClear={handleClearFilters}
      />

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-border/50 space-y-3 rounded-xl border p-5">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-1.5 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={hasFilters ? t('no_results') : t('no_projects')}
          description={hasFilters ? t('no_results_desc') : t('no_projects_desc')}
          action={
            !hasFilters ? (
              <Button onClick={handleCreateProject} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
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

      {/* Create/Edit Dialog */}
      <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={editingProject} />
    </div>
  );
}
