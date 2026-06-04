'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Plus, FolderOpen, Search, X } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectDialog } from '@/components/projects/ProjectDialog';
import {
  useProjectsQuery,
  useDeleteProject,
  type Project,
  type ProjectStatus,
  type Priority,
} from '@/hooks/use-projects';
import { useDialogStore } from '@/store/dialog.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const STATUS_OPTIONS: { value: ProjectStatus; key: string }[] = [
  { value: 'PLANNING', key: 'status_planning' },
  { value: 'ACTIVE', key: 'status_active' },
  { value: 'PAUSED', key: 'status_paused' },
  { value: 'COMPLETED', key: 'status_completed' },
  { value: 'ARCHIVED', key: 'status_archived' },
];

const PRIORITY_OPTIONS: { value: Priority; key: string }[] = [
  { value: 'LOW', key: 'priority_low' },
  { value: 'MEDIUM', key: 'priority_medium' },
  { value: 'HIGH', key: 'priority_high' },
  { value: 'URGENT', key: 'priority_urgent' },
];

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
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t('search_placeholder')}
            className="pl-9 h-9"
          />
        </div>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline' }), 'h-9 gap-2 font-medium text-sm')}>
            {status ? t(STATUS_OPTIONS.find(s => s.value === status)?.key as any) : t('filter_status')}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {STATUS_OPTIONS.map(s => (
              <DropdownMenuItem
                key={s.value}
                onClick={() => setStatus(prev => prev === s.value ? '' : s.value)}
                className={cn(status === s.value && 'bg-accent font-semibold')}
              >
                {t(s.key as any)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline' }), 'h-9 gap-2 font-medium text-sm')}>
            {priority ? t(PRIORITY_OPTIONS.find(p => p.value === priority)?.key as any) : t('filter_priority')}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {PRIORITY_OPTIONS.map(p => (
              <DropdownMenuItem
                key={p.value}
                onClick={() => setPriority(prev => prev === p.value ? '' : p.value)}
                className={cn(priority === p.value && 'bg-accent font-semibold')}
              >
                {t(p.key as any)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1.5 text-muted-foreground">
            <X className="h-3.5 w-3.5" />
            {t('clear_filters')}
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border/50 p-5 space-y-3">
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
              <Button onClick={handleCreateProject} className="gap-2 mt-4">
                <Plus className="h-4 w-4" />
                {t('create_project')}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
      />
    </div>
  );
}
