'use client';

import { LayoutTemplate, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export type ViewMode = 'board' | 'list';

interface ViewToggleProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}

export function ViewToggle({ value, onChange }: ViewToggleProps) {
  const t = useTranslations('Tasks');

  const options: { value: ViewMode; icon: typeof LayoutTemplate; label: string }[] = [
    { value: 'board', icon: LayoutTemplate, label: t('view_board') },
    { value: 'list', icon: List, label: t('view_list') },
  ];

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border/50 bg-muted/40 p-1">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
