'use client';

import { useTranslations } from 'next-intl';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  Calendar,
  Download,
  Upload,
  RefreshCw,
  ListChecks,
  Layers,
} from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DatePickerTrigger } from '@/components/planner/DatePickerTrigger';
import type { ViewMode } from '@/components/calendar/ViewSwitcher';

interface CalendarHeaderProps {
  date: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onSyncPlannerPreview: () => void;
  onSyncTasksPreview: () => void;
  onSyncAllPreview: () => void;
  onImportFromCalendar: () => void;
  onForceReset: () => void;
  isSyncing: boolean;
  isImporting: boolean;
  isCalendarConnected: boolean;
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

export function CalendarHeader({
  date,
  viewMode,
  onDateChange,
  onGenerate,
  isGenerating,
  onSyncPlannerPreview,
  onSyncTasksPreview,
  onSyncAllPreview,
  onImportFromCalendar,
  onForceReset,
  isSyncing = false,
  isImporting = false,
  isCalendarConnected = false,
}: CalendarHeaderProps) {
  const t = useTranslations('Calendar');

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Nav: prev / date picker / next */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onDateChange(navigatePrev(date, viewMode))}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <DatePickerTrigger date={date} onSelect={onDateChange} />

        <button
          type="button"
          onClick={() => onDateChange(navigateNext(date, viewMode))}
          className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onDateChange(new Date())}
          className="text-muted-foreground hover:bg-muted hover:text-foreground ml-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors"
        >
          {t('date_picker_today')}
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isCalendarConnected && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5')}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('sync')}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onClick={onSyncPlannerPreview}
                disabled={isSyncing}
                className="gap-2"
              >
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {t('sync_planner')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSyncTasksPreview} disabled={isSyncing} className="gap-2">
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ListChecks className="h-4 w-4" />
                )}
                {t('sync_tasks')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSyncAllPreview} disabled={isSyncing} className="gap-2">
                {isSyncing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Layers className="h-4 w-4" />
                )}
                {t('sync_all')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onImportFromCalendar}
                disabled={isImporting}
                className="gap-2"
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {t('import_from_calendar')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onForceReset} className="text-destructive gap-2">
                <RefreshCw className="h-4 w-4" />
                {t('force_resync')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

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
