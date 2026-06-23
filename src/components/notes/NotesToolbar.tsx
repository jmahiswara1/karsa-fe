'use client';

import { useTranslations } from 'next-intl';
import { Plus, X, ChevronDown } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { SearchInput } from '@/components/shared/SearchInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface NotesToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  projectId: string;
  onProjectChange: (id: string) => void;
  hasFilters: boolean;
  onClear: () => void;
  projects: { id: string; title: string }[];
  currentFolderId: string | null;
  onCreateFolder: (parentId: string | null) => void;
  onCreateNote: () => void;
}

export function NotesToolbar({
  search,
  onSearchChange,
  projectId,
  onProjectChange,
  hasFilters,
  onClear,
  projects,
  currentFolderId,
  onCreateFolder,
  onCreateNote,
}: NotesToolbarProps) {
  const t = useTranslations('Notes');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search + Filters */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={t('search_placeholder')}
        />

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-9 gap-2 text-sm font-medium',
              )}
            >
              <span className="truncate">
                {projectId
                  ? projects.find((p) => p.id === projectId)?.title || t('filter_project')
                  : t('filter_project')}
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
              <DropdownMenuItem
                onClick={() => onProjectChange('')}
                className={cn(!projectId && 'bg-accent font-semibold')}
              >
                {t('filter_project')}
              </DropdownMenuItem>
              {projects.map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onClick={() => onProjectChange(p.id)}
                  className={cn(projectId === p.id && 'bg-accent font-semibold')}
                >
                  {p.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="text-muted-foreground gap-1.5"
            >
              <X className="h-3.5 w-3.5" />
              {t('clear_filters')}
            </Button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="outline"
          onClick={() => onCreateFolder(currentFolderId)}
          size="sm"
          className="h-9 gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          {t('create_folder')}
        </Button>
        <Button onClick={onCreateNote} size="sm" className="h-9 gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          {t('create_note')}
        </Button>
      </div>
    </div>
  );
}
