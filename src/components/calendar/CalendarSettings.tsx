'use client';

import { useTranslations } from 'next-intl';
import { Cloud, RefreshCw, History, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useSyncHistory, type SyncLogEntry } from '@/hooks/use-calendar-sync';
import { cn } from '@/lib/utils';

interface CalendarSettingsProps {
  connected: boolean;
  lastSyncAt?: string | null;
  onForceReset?: () => void;
  isResetting?: boolean;
}

export function CalendarSettings({
  connected,
  lastSyncAt,
  onForceReset,
  isResetting = false,
}: CalendarSettingsProps) {
  const t = useTranslations('Calendar');
  const { data: syncHistory, isLoading: historyLoading } = useSyncHistory();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Connection Card */}
      <div
        className="relative overflow-hidden rounded-2xl px-6 py-5 shadow-lg"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.62 0.22 255) 0%, oklch(0.55 0.24 265) 50%, oklch(0.50 0.22 278) 100%)',
        }}
      >
        <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/8" />
        <div className="pointer-events-none absolute -right-4 -bottom-10 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{t('settings_connection')}</h3>
              <p className="text-sm text-white/60">
                {connected ? t('sync_status_connected') : t('sync_status_disconnected')}
              </p>
            </div>
          </div>

          {connected && (
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-white/10 bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <Cloud className="h-3.5 w-3.5" />
                  {lastSyncAt
                    ? `${t('last_sync')}: ${new Date(lastSyncAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`
                    : t('never_synced')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sync History */}
      <div className="bg-card ring-border/30 rounded-2xl p-5 ring-1">
        <div className="mb-4 flex items-center gap-2">
          <History className="text-muted-foreground h-4 w-4" />
          <h3 className="text-sm font-semibold">{t('settings_history')}</h3>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          </div>
        ) : !syncHistory || syncHistory.length === 0 ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            {t('sync_history_empty')}
          </p>
        ) : (
          <div className="space-y-2">
            {syncHistory.map((log: SyncLogEntry) => {
              const actionLabel = getActionLabel(log.action);
              const hasErrors = log.failedCount > 0;
              return (
                <div
                  key={log.id}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5',
                    hasErrors ? 'bg-red-50 dark:bg-red-900/10' : 'bg-muted/30',
                  )}
                >
                  <div
                    className={cn(
                      'h-2 w-2 shrink-0 rounded-full',
                      hasErrors ? 'bg-red-500' : 'bg-emerald-500',
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{actionLabel}</span>
                      {hasErrors && (
                        <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
                          {log.failedCount} failed
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {log.syncedCount > 0 && `${log.syncedCount} synced`}
                      {log.syncedCount > 0 && log.updatedCount > 0 && ' · '}
                      {log.updatedCount > 0 && `${log.updatedCount} updated`}
                      {log.rangeStart && log.rangeEnd && (
                        <span className="ml-1">
                          ({log.rangeStart} – {log.rangeEnd})
                        </span>
                      )}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-[10px]">
                    {formatRelativeTime(new Date(log.createdAt))}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-card ring-border/30 rounded-2xl p-5 ring-1">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="text-destructive h-4 w-4" />
          <h3 className="text-destructive text-sm font-semibold">{t('settings_danger')}</h3>
        </div>
        <p className="text-muted-foreground mb-4 text-xs">{t('settings_danger_desc')}</p>
        <Button
          variant="destructive"
          size="sm"
          onClick={onForceReset}
          disabled={isResetting || !connected}
          className="gap-2"
        >
          {isResetting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {t('force_resync_all')}
        </Button>
      </div>
    </motion.div>
  );
}

function getActionLabel(action: string): string {
  switch (action) {
    case 'sync-to-calendar':
      return 'Sync Planner';
    case 'sync-tasks':
      return 'Sync Tasks';
    case 'sync-all':
      return 'Sync All';
    case 'import-from-calendar':
      return 'Import from Calendar';
    case 'force-reset':
      return 'Force Reset';
    default:
      return action;
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}d`;
}
