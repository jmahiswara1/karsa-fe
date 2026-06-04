'use client';

import { useTranslations } from 'next-intl';
import { Search, X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { TaskStatus, Priority } from '@/hooks/use-tasks';

interface TaskFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: TaskStatus | '';
  onStatusChange: (value: TaskStatus | '') => void;
  priority: Priority | '';
  onPriorityChange: (value: Priority | '') => void;
  onClear: () => void;
}

const STATUS_OPTIONS: { value: TaskStatus; label: string; key: string }[] = [
  { value: 'TODO', label: 'Todo', key: 'status_todo' },
  { value: 'IN_PROGRESS', label: 'In Progress', key: 'status_in_progress' },
  { value: 'DONE', label: 'Done', key: 'status_done' },
  { value: 'CANCELLED', label: 'Cancelled', key: 'status_cancelled' },
];

const PRIORITY_OPTIONS: { value: Priority; label: string; key: string }[] = [
  { value: 'LOW', label: 'Low', key: 'priority_low' },
  { value: 'MEDIUM', label: 'Medium', key: 'priority_medium' },
  { value: 'HIGH', label: 'High', key: 'priority_high' },
  { value: 'URGENT', label: 'Urgent', key: 'priority_urgent' },
];

export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  onClear,
}: TaskFiltersProps) {
  const t = useTranslations('Tasks');
  const hasActiveFilters = status !== '' || priority !== '' || search !== '';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('search_placeholder')}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline' }), "h-9 w-[160px] justify-between font-normal text-muted-foreground hover:text-foreground")}>
            {status ? t(STATUS_OPTIONS.find(s => s.value === status)?.key as any) : t('all_status')}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuRadioGroup
              value={status || 'ALL'}
              onValueChange={(val) => onStatusChange(val === 'ALL' ? '' : (val as TaskStatus))}
            >
              <DropdownMenuRadioItem value="ALL">{t('all_status')}</DropdownMenuRadioItem>
              {STATUS_OPTIONS.map((s) => (
                <DropdownMenuRadioItem key={s.value} value={s.value}>
                  {t(s.key as any)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline' }), "h-9 w-[160px] justify-between font-normal text-muted-foreground hover:text-foreground")}>
            {priority ? t(PRIORITY_OPTIONS.find(p => p.value === priority)?.key as any) : t('all_priority')}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuRadioGroup
              value={priority || 'ALL'}
              onValueChange={(val) => onPriorityChange(val === 'ALL' ? '' : (val as Priority))}
            >
              <DropdownMenuRadioItem value="ALL">{t('all_priority')}</DropdownMenuRadioItem>
              {PRIORITY_OPTIONS.map((p) => (
                <DropdownMenuRadioItem key={p.value} value={p.value}>
                  {t(p.key as any)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1.5 text-muted-foreground">
            <X className="h-3.5 w-3.5" />
            {t('clear_filters')}
          </Button>
        )}
      </div>
    </div>
  );
}
