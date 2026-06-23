'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { X, ChevronDown } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { SearchInput } from '@/components/shared/SearchInput';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { ProjectStatus, Priority } from '@/hooks/use-projects';

interface ProjectFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: ProjectStatus | '';
  onStatusChange: (value: ProjectStatus | '') => void;
  priority: Priority | '';
  onPriorityChange: (value: Priority | '') => void;
  onClear: () => void;
  action?: ReactNode;
}

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

export function ProjectFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  onClear,
  action,
}: ProjectFiltersProps) {
  const t = useTranslations('Projects');
  const hasActiveFilters = status !== '' || priority !== '' || search !== '';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search + Filters */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={t('search_placeholder')}
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-9 gap-2 text-sm font-medium',
              )}
            >
              {status
                ? t(
                    (STATUS_OPTIONS.find((s) => s.value === status)?.key ||
                      'filter_status') as never,
                  )
                : t('filter_status')}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={status || 'ALL'}
                onValueChange={(val) => onStatusChange(val === 'ALL' ? '' : (val as ProjectStatus))}
              >
                <DropdownMenuRadioItem value="ALL">{t('filter_status')}</DropdownMenuRadioItem>
                {STATUS_OPTIONS.map((s) => (
                  <DropdownMenuRadioItem key={s.value} value={s.value}>
                    {t(s.key as never)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-9 gap-2 text-sm font-medium',
              )}
            >
              {priority
                ? t(
                    (PRIORITY_OPTIONS.find((p) => p.value === priority)?.key ||
                      'filter_priority') as never,
                  )
                : t('filter_priority')}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={priority || 'ALL'}
                onValueChange={(val) => onPriorityChange(val === 'ALL' ? '' : (val as Priority))}
              >
                <DropdownMenuRadioItem value="ALL">{t('filter_priority')}</DropdownMenuRadioItem>
                {PRIORITY_OPTIONS.map((p) => (
                  <DropdownMenuRadioItem key={p.value} value={p.value}>
                    {t(p.key as never)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear */}
          {hasActiveFilters && (
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

      {/* Action */}
      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </div>
  );
}
