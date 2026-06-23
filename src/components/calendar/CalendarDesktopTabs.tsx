'use client';

import { useTranslations } from 'next-intl';
import { Calendar as CalendarIcon, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarTab } from '@/hooks/use-calendar-page-state';

const TABS: { key: CalendarTab; icon: typeof CalendarIcon; labelKey: string }[] = [
  { key: 'view', icon: CalendarIcon, labelKey: 'tab_view' },
  { key: 'settings', icon: Settings, labelKey: 'tab_settings' },
];

interface CalendarDesktopTabsProps {
  activeTab: CalendarTab;
  onTabChange: (t: CalendarTab) => void;
}

export function CalendarDesktopTabs({ activeTab, onTabChange }: CalendarDesktopTabsProps) {
  const tCal = useTranslations('Calendar');

  return (
    <div className="flex gap-1">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'flex h-9 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-all',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            {tCal(tab.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
