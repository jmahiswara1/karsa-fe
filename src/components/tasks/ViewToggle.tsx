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
    <div className="border-border/50 bg-muted/30 flex rounded-xl border p-1">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
              isActive
                ? 'text-foreground ring-border bg-white shadow-sm ring-1 dark:bg-slate-800'
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
