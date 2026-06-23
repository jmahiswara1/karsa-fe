'use client';

import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CalendarSyncResult } from '@/hooks/use-calendar-google-sync';

export function showSyncResultToast(result: CalendarSyncResult, onRetry?: () => void) {
  const total = result.synced + result.updated;
  const hasErrors = result.errors.length > 0;

  if (!hasErrors) {
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <span>
          {result.synced > 0 && `${result.synced} created`}
          {result.synced > 0 && result.updated > 0 && ', '}
          {result.updated > 0 && `${result.updated} updated`}
          {total === 0 && 'No changes'}
          {' to Google Calendar'}
        </span>
      </div>,
    );
    return;
  }

  toast.error(
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <span>
          {result.synced > 0 && `${result.synced} created`}
          {result.synced > 0 && result.updated > 0 && ', '}
          {result.updated > 0 && `${result.updated} updated`}
          {', '}
          {result.errors.length} failed
        </span>
      </div>
      <div className="text-muted-foreground space-y-1 text-xs">
        {result.errors.slice(0, 3).map((err, i) => (
          <p key={i} className="truncate">
            {err}
          </p>
        ))}
        {result.errors.length > 3 && (
          <p className="text-muted-foreground/60">+{result.errors.length - 3} more</p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1 gap-1.5">
          <RefreshCw className="h-3 w-3" />
          Retry failed
        </Button>
      )}
    </div>,
    { duration: 8000 },
  );
}
