'use client';

import { useMemo } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { PageBanner } from '@/components/shared/PageBanner';
import { CalendarDesktopTabs } from '@/components/calendar/CalendarDesktopTabs';
import { CalendarViewTab, EntriesCountChip } from '@/components/calendar/CalendarViewTab';
import { CalendarSettings } from '@/components/calendar/CalendarSettings';
import { MobileTabBar } from '@/components/calendar/MobileTabBar';
import { GeneratePlanDialog } from '@/components/planner/GeneratePlanDialog';
import { PlannerEntryDialog } from '@/components/planner/PlannerEntryDialog';
import { SyncPreviewDialog } from '@/components/calendar/SyncPreviewDialog';
import { ImportFromCalendarDialog } from '@/components/calendar/ImportFromCalendarDialog';
import { useCalendarPageState } from '@/hooks/use-calendar-page-state';
import { useCalendarSyncActions, useCalendarSyncRange } from '@/hooks/use-calendar-sync-actions';
import { useCalendarStatus, useCalendarEvents } from '@/hooks/use-calendar-google-sync';

export default function CalendarPage() {
  const { user } = useAuthStore();
  const state = useCalendarPageState();

  const { data: isCalendarConnected = false } = useCalendarStatus();
  const syncRange = useCalendarSyncRange(state.queryParams);
  const { data: googleEvents = [] } = useCalendarEvents({
    startDate: syncRange.startDate,
    endDate: syncRange.endDate,
    enabled: isCalendarConnected,
  });

  const {
    handleSyncConfirm,
    handleImportConfirm,
    handleForceReset,
    isAnySyncing,
    isImporting,
    isResetting,
  } = useCalendarSyncActions(
    () => state.setSyncPreviewMode(null),
    () => state.setImportDialogOpen(false),
  );

  const subtitle = useMemo(
    () =>
      state.date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      }),
    [state.date],
  );

  return (
    <div className="space-y-4 pb-24 sm:pb-8">
      <PageBanner
        user={user}
        subtitle={subtitle}
        rightSlot={<EntriesCountChip count={state.entries.length} />}
      />

      <CalendarDesktopTabs activeTab={state.activeTab} onTabChange={state.setActiveTab} />

      {state.activeTab === 'view' ? (
        <CalendarViewTab
          date={state.date}
          viewMode={state.viewMode}
          onDateChange={state.setDate}
          onViewModeChange={state.setViewMode}
          onDayClick={(d) => {
            state.setDate(d);
            state.setViewMode('day');
          }}
          entries={state.entries}
          googleEvents={googleEvents}
          isLoading={state.isLoading}
          onEntryClick={state.handleEntryClick}
          onSlotClick={state.handleSlotClick}
          onEntryDrop={state.handleEntryDrop}
          onGenerate={() => state.setGenerateDialogOpen(true)}
          isGenerating={state.isGenerating}
          onSyncPlannerPreview={() => state.setSyncPreviewMode('planner')}
          onSyncTasksPreview={() => state.setSyncPreviewMode('tasks')}
          onSyncAllPreview={() => state.setSyncPreviewMode('all')}
          onImportFromCalendar={() => state.setImportDialogOpen(true)}
          onForceReset={handleForceReset}
          isSyncing={isAnySyncing}
          isImporting={isImporting}
          isCalendarConnected={isCalendarConnected}
        />
      ) : (
        <CalendarSettings
          connected={isCalendarConnected}
          onForceReset={handleForceReset}
          isResetting={isResetting}
        />
      )}

      <MobileTabBar viewMode={state.viewMode} onViewModeChange={state.setViewMode} />

      {/* Dialogs */}
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

      <SyncPreviewDialog
        open={state.syncPreviewMode !== null}
        onOpenChange={() => state.setSyncPreviewMode(null)}
        startDate={syncRange.startDate}
        endDate={syncRange.endDate}
        onConfirm={() =>
          state.syncPreviewMode && handleSyncConfirm(state.syncPreviewMode, syncRange)
        }
        isSyncing={isAnySyncing}
        mode={state.syncPreviewMode ?? 'planner'}
      />

      <ImportFromCalendarDialog
        open={state.importDialogOpen}
        onOpenChange={state.setImportDialogOpen}
        startDate={syncRange.startDate}
        endDate={syncRange.endDate}
        onConfirm={() => handleImportConfirm(syncRange)}
        isImporting={isImporting}
      />
    </div>
  );
}
