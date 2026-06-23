'use client';

import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewToggle, type ViewMode } from './ViewToggle';
import { TaskFilters } from './TaskFilters';
import type { TaskStatus, Priority } from '@/hooks/use-tasks';
import type { SortOption } from './TaskList';

interface TasksToolbarProps {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
  search: string;
  onSearchChange: (v: string) => void;
  status: TaskStatus | '';
  onStatusChange: (v: TaskStatus | '') => void;
  priority: Priority | '';
  onPriorityChange: (v: Priority | '') => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  onClear: () => void;
  onCreateTask: () => void;
}

export function TasksToolbar({
  view,
  onViewChange,
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
  onClear,
  onCreateTask,
}: TasksToolbarProps) {
  const t = useTranslations('Tasks');

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* View Toggle */}
      <ViewToggle value={view} onChange={onViewChange} />

      {/* Search + Filters */}
      <TaskFilters
        search={search}
        onSearchChange={onSearchChange}
        status={status}
        onStatusChange={onStatusChange}
        priority={priority}
        onPriorityChange={onPriorityChange}
        onClear={onClear}
        sort={sort}
        onSortChange={onSortChange}
      />

      {/* Create Button */}
      <div className="flex shrink-0 items-center">
        <Button onClick={onCreateTask} size="sm" className="h-9 gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          {t('create_task')}
        </Button>
      </div>
    </div>
  );
}
