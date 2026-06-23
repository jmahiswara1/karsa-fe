'use client';

import { useTranslations } from 'next-intl';
import { Calendar, CalendarDays, CalendarRange, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'day' | 'week' | 'month' | 'agenda';

interface ViewSwitcherProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const views: { key: ViewMode; icon: typeof Calendar; labelKey: string }[] = [
  { key: 'day', icon: Calendar, labelKey: 'view_day' },
  { key: 'week', icon: CalendarDays, labelKey: 'view_week' },
  { key: 'month', icon: CalendarRange, labelKey: 'view_month' },
  { key: 'agenda', icon: List, labelKey: 'view_agenda' },
];

export function ViewSwitcher({ viewMode, onViewModeChange }: ViewSwitcherProps) {
  const t = useTranslations('Calendar');

  return (
    <div className="border-border/50 bg-muted/30 flex rounded-xl border p-1">
      {views.map((view) => {
        const Icon = view.icon;
        const active = viewMode === view.key;
        return (
          <button
            key={view.key}
            type="button"
            onClick={() => onViewModeChange(view.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
              active
                ? 'text-foreground ring-border bg-white shadow-sm ring-1 dark:bg-slate-800'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t(view.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
