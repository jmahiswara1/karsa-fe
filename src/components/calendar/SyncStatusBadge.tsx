'use client';

import { useTranslations } from 'next-intl';
import { Cloud, Loader2, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SyncStatusBadgeProps {
  connected: boolean;
  syncing?: boolean;
  lastSyncAt?: string | null;
  onConnect?: () => void;
  onSync?: () => void;
}

export function SyncStatusBadge({
  connected,
  syncing = false,
  lastSyncAt,
  onConnect,
}: SyncStatusBadgeProps) {
  const t = useTranslations('Calendar');

  if (!connected) {
    return (
      <button
        type="button"
        onClick={onConnect}
        className="ring-border/30 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 backdrop-blur-sm transition-all hover:bg-white/25"
      >
        <WifiOff className="h-3.5 w-3.5" />
        {t('connect_google')}
      </button>
    );
  }

  if (syncing) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/15 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {t('sync_status_syncing')}
      </div>
    );
  }

  const timeAgo = lastSyncAt ? getTimeAgo(new Date(lastSyncAt)) : null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm',
        'border-white/10 bg-white/15 text-white/90',
      )}
    >
      <Cloud className="h-3.5 w-3.5" />
      <span>{t('sync_status_connected')}</span>
      {timeAgo && (
        <span className="text-white/50">
          {t('last_sync')}: {timeAgo}
        </span>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
