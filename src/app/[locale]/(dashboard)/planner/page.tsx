'use client';

import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { PageBanner } from '@/components/shared/PageBanner';
import { PlannerHeader } from '@/components/planner/PlannerHeader';
import { FocusList } from '@/components/planner/FocusList';
import { EmptyFocus } from '@/components/planner/EmptyFocus';
import { GeneratePlanDialog } from '@/components/planner/GeneratePlanDialog';
import { PlannerEntryDialog } from '@/components/planner/PlannerEntryDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { EntriesCountChip } from '@/components/calendar/CalendarViewTab';
import { usePlannerPageState } from '@/hooks/use-planner-page-state';

export default function FocusPage() {
  const tPages = useTranslations('Pages');
  const locale = useLocale();
  const state = usePlannerPageState();

  const subtitle = useMemo(
    () =>
      state.date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    [state.date, locale],
  );

  return (
    <div className="space-y-4 pb-24 sm:pb-8">
      <PageBanner
        title={tPages('focus_title')}
        subtitle={subtitle}
        rightSlot={<EntriesCountChip count={state.entries.length} />}
        bottomSlot={
          state.lastFocusMessage ? (
            <div className="flex items-start gap-2 px-6 py-4">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />
              <p className="text-sm font-medium text-white/90">{state.lastFocusMessage}</p>
            </div>
          ) : undefined
        }
      />

      <PlannerHeader
        date={state.date}
        viewMode="day"
        onDateChange={state.setDate}
        onGenerate={() => state.setGenerateDialogOpen(true)}
        isGenerating={state.isGenerating}
        onAdd={state.handleAddClick}
      />

      {state.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : state.entries.length === 0 ? (
        <EmptyFocus
          onSuggest={() => state.setGenerateDialogOpen(true)}
          onAdd={state.handleAddClick}
          isGenerating={state.isGenerating}
        />
      ) : (
        <FocusList
          entries={state.entries}
          onItemClick={state.handleEntryClick}
          onReorder={state.handleReorder}
        />
      )}

      <PlannerEntryDialog
        open={state.dialogOpen}
        onOpenChange={state.setDialogOpen}
        entry={state.editingEntry}
        defaultHour={state.defaultHour}
        defaultDate={state.clickedDate}
        onSubmit={state.handleDialogSubmit}
        onDelete={state.editingEntry ? state.handleDelete : undefined}
        isSubmitting={state.isSubmitting}
      />

      <GeneratePlanDialog
        open={state.generateDialogOpen}
        onOpenChange={state.setGenerateDialogOpen}
        defaultDate={state.date}
        onGenerate={state.handleGenerate}
        isGenerating={state.isGenerating}
      />
    </div>
  );
}
