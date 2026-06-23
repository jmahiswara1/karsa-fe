'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, ListChecks, Layers, Calendar, Inbox } from 'lucide-react';
import { useSyncPreview } from '@/hooks/use-calendar-google-sync';
import type { SyncPreviewEntry, SyncPreviewTask } from '@/hooks/use-calendar-google-sync';

interface SyncPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startDate: string;
  endDate: string;
  onConfirm: () => void;
  isSyncing: boolean;
  mode: 'planner' | 'tasks' | 'all';
}

export function SyncPreviewDialog({
  open,
  onOpenChange,
  startDate,
  endDate,
  onConfirm,
  isSyncing,
  mode,
}: SyncPreviewDialogProps) {
  const t = useTranslations('Calendar');
  const { data: preview, isLoading } = useSyncPreview({
    startDate,
    endDate,
    enabled: open,
  });

  const plannerEntries = preview?.plannerEntries ?? [];
  const tasks = preview?.tasks ?? [];
  const hasItems =
    mode === 'planner'
      ? plannerEntries.length > 0
      : mode === 'tasks'
        ? tasks.length > 0
        : plannerEntries.length > 0 || tasks.length > 0;

  const buttonIcon =
    mode === 'all' ? (
      <Layers className="mr-2 h-4 w-4" />
    ) : mode === 'tasks' ? (
      <ListChecks className="mr-2 h-4 w-4" />
    ) : (
      <Upload className="mr-2 h-4 w-4" />
    );

  const buttonLabel =
    mode === 'all'
      ? `${t('sync_all')} (${plannerEntries.length + tasks.length})`
      : mode === 'tasks'
        ? `${t('sync_tasks')} (${tasks.length})`
        : `${t('sync_planner')} (${plannerEntries.length})`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'all'
              ? t('sync_all')
              : mode === 'tasks'
                ? t('sync_tasks')
                : t('sync_planner')}
          </DialogTitle>
          <DialogDescription>
            {startDate} – {endDate}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-4 overflow-y-auto py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
            </div>
          ) : !hasItems ? (
            <div className="text-muted-foreground flex flex-col items-center gap-2 py-8">
              <Inbox className="h-8 w-8" />
              <span className="text-sm">{t('no_items_to_sync')}</span>
            </div>
          ) : (
            <>
              {/* Planner entries section */}
              {(mode === 'planner' || mode === 'all') && plannerEntries.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Calendar className="text-muted-foreground h-3.5 w-3.5" />
                    <span className="text-foreground text-xs font-semibold">
                      {t('sync_section_planner')} ({plannerEntries.length})
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {plannerEntries.map((entry: SyncPreviewEntry) => (
                      <PreviewItem
                        key={entry.id}
                        title={entry.title}
                        subtitle={`${entry.startTime} – ${entry.endTime}`}
                        synced={!!entry.googleEventId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks section */}
              {(mode === 'tasks' || mode === 'all') && tasks.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <ListChecks className="text-muted-foreground h-3.5 w-3.5" />
                    <span className="text-foreground text-xs font-semibold">
                      {t('sync_section_tasks')} ({tasks.length})
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {tasks.map((task: SyncPreviewTask) => (
                      <PreviewItem
                        key={task.id}
                        title={task.title}
                        subtitle={
                          task.deadline ? `${t('task_allday')} ${task.deadline}` : t('no_deadline')
                        }
                        synced={!!task.googleEventId}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSyncing}
          >
            {t('cancel')}
          </Button>
          <Button onClick={onConfirm} disabled={isLoading || isSyncing || !hasItems}>
            {isSyncing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('syncing')}
              </>
            ) : (
              <>
                {buttonIcon}
                {buttonLabel}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PreviewItem({
  title,
  subtitle,
  synced,
}: {
  title: string;
  subtitle: string;
  synced: boolean;
}) {
  return (
    <div className="bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2">
      <div
        className={`h-2 w-2 shrink-0 rounded-full ${synced ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs">{subtitle}</p>
      </div>
      {synced && <span className="text-[10px] font-medium text-emerald-600">synced</span>}
    </div>
  );
}
