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
    <>
      <div className="flex items-center justify-end gap-3">
        <ViewToggle value={view} onChange={onViewChange} />
        <Button onClick={onCreateTask} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('create_task')}
        </Button>
      </div>

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
    </>
  );
}
