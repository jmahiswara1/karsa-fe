'use client';

import { useTranslations } from 'next-intl';
import { Calendar, CalendarDays, CalendarRange, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ViewMode } from './ViewSwitcher';

interface MobileTabBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const tabs: { key: ViewMode; icon: typeof Calendar; labelKey: string }[] = [
  { key: 'day', icon: Calendar, labelKey: 'view_day' },
  { key: 'week', icon: CalendarDays, labelKey: 'view_week' },
  { key: 'month', icon: CalendarRange, labelKey: 'view_month' },
  { key: 'agenda', icon: List, labelKey: 'view_agenda' },
];

export function MobileTabBar({ viewMode, onViewModeChange }: MobileTabBarProps) {
  const t = useTranslations('Calendar');

  return (
    <div className="bg-card border-border/50 fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t px-2 py-2 sm:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = viewMode === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onViewModeChange(tab.key)}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all',
              active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-5 w-5" />
            {t(tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
