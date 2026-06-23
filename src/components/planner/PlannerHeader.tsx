'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Sparkles, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePickerTrigger } from './DatePickerTrigger';

type ViewMode = 'day' | 'week' | 'month' | 'agenda';

interface PlannerHeaderProps {
  date: Date;
  viewMode?: ViewMode;
  onDateChange: (date: Date) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onAdd?: () => void;
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

export function PlannerHeader({
  date,
  viewMode = 'day',
  onDateChange,
  onGenerate,
  isGenerating,
  onAdd,
}: PlannerHeaderProps) {
  const t = useTranslations('Focus');

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Nav: prev / date picker / next */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onDateChange(navigatePrev(date, viewMode))}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <DatePickerTrigger date={date} onSelect={onDateChange} />

        <button
          type="button"
          onClick={() => onDateChange(navigateNext(date, viewMode))}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDateChange(new Date())}
          className="text-muted-foreground hover:bg-muted hover:text-foreground ml-1 flex h-9 items-center rounded-lg px-3 text-xs font-medium transition-colors"
        >
          {t('date_picker_today')}
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onAdd && (
          <Button variant="outline" onClick={onAdd} size="sm" className="h-9 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t('action_add_focus')}</span>
          </Button>
        )}

        <Button onClick={onGenerate} disabled={isGenerating} size="sm" className="h-9 gap-1.5">
          {isGenerating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {t('generating')}
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              {t('action_suggest')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
