'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ViewMode = 'day' | 'week' | 'month';

interface PlannerHeaderProps {
  date: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

function formatHeaderDate(date: Date, mode: ViewMode): string {
  if (mode === 'day') {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  if (mode === 'week') {
    const start = new Date(date);
    const day = start.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + diff);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('id-ID', opts)}`;
  }
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

function navigatePrev(date: Date, mode: ViewMode): Date {
  const d = new Date(date);
  if (mode === 'day') d.setDate(d.getDate() - 1);
  else if (mode === 'week') d.setDate(d.getDate() - 7);
  else d.setMonth(d.getMonth() - 1);
  return d;
}

function navigateNext(date: Date, mode: ViewMode): Date {
  const d = new Date(date);
  if (mode === 'day') d.setDate(d.getDate() + 1);
  else if (mode === 'week') d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

const views: { key: ViewMode; labelKey: string }[] = [
  { key: 'day', labelKey: 'day' },
  { key: 'week', labelKey: 'week' },
  { key: 'month', labelKey: 'month' },
];

export function PlannerHeader({
  date,
  viewMode,
  onDateChange,
  onViewModeChange,
  onGenerate,
  isGenerating,
}: PlannerHeaderProps) {
  const t = useTranslations('Planner');

  const handleToday = () => onDateChange(new Date());

  return (
    <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
      {/* Nav */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onDateChange(navigatePrev(date, viewMode))}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={handleToday}
          className="text-foreground hover:bg-muted rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors"
        >
          {formatHeaderDate(date, viewMode)}
        </button>

        <button
          type="button"
          onClick={() => onDateChange(navigateNext(date, viewMode))}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* View Switcher + AI */}
      <div className="flex items-center gap-2">
        <div className="border-border/50 bg-muted/30 flex rounded-xl border p-1">
          {views.map((v) => (
            <button
              key={v.key}
              type="button"
              onClick={() => onViewModeChange(v.key)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all',
                viewMode === v.key
                  ? 'text-foreground ring-border bg-white shadow-sm ring-1 dark:bg-slate-800'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(v.labelKey)}
            </button>
          ))}
        </div>

        <Button onClick={onGenerate} disabled={isGenerating} size="sm" className="gap-1.5">
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t('generating')}
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              {t('generate_button')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
