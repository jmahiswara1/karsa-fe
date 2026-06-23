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
import { Loader2, Download, Inbox, Clock } from 'lucide-react';
import { useCalendarEvents } from '@/hooks/use-calendar-sync';

interface ImportFromCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startDate: string;
  endDate: string;
  onConfirm: () => void;
  isImporting: boolean;
}

export function ImportFromCalendarDialog({
  open,
  onOpenChange,
  startDate,
  endDate,
  onConfirm,
  isImporting,
}: ImportFromCalendarDialogProps) {
  const t = useTranslations('Calendar');
  const tFocus = useTranslations('Focus');
  const { data: events, isLoading } = useCalendarEvents({
    startDate,
    endDate,
    enabled: open,
  });

  const timedEvents = events?.filter((e) => e.start?.dateTime && e.end?.dateTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tFocus('import_from_calendar')}</DialogTitle>
          <DialogDescription>
            {timedEvents
              ? `${timedEvents.length} events found in this range`
              : tFocus('sync_preview_loading')}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-2 overflow-y-auto py-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
            </div>
          ) : !timedEvents || timedEvents.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center gap-2 py-8">
              <Inbox className="h-8 w-8" />
              <span className="text-sm">{t('no_google_events')}</span>
            </div>
          ) : (
            timedEvents.map((event) => {
              const start = event.start?.dateTime;
              const end = event.end?.dateTime;
              const startDate = start ? new Date(start) : null;
              const endDate = end ? new Date(end) : null;

              return (
                <div
                  key={event.id}
                  className="bg-muted/40 flex items-center gap-3 rounded-lg px-3 py-2"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{event.summary ?? 'Untitled'}</p>
                    {startDate && endDate && (
                      <p className="text-muted-foreground flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        {startDate.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                        })}{' '}
                        {startDate.toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' – '}
                        {endDate.toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            {tFocus('cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || isImporting || !timedEvents || timedEvents.length === 0}
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {tFocus('syncing')}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import {timedEvents?.length ?? 0} events
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
