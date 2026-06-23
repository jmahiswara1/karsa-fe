'use client';

import { useTranslations } from 'next-intl';
import type { PlannerEntry } from '@/hooks/use-planner';
import { Clock, Sparkles, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgendaViewProps {
  entries: PlannerEntry[];
  onEntryClick: (entry: PlannerEntry) => void;
}

export function AgendaView({ entries, onEntryClick }: AgendaViewProps) {
  const t = useTranslations('Calendar');

  const grouped = new Map<string, PlannerEntry[]>();
  for (const entry of entries) {
    const dateKey =
      typeof entry.date === 'string'
        ? entry.date.split('T')[0]
        : new Date(entry.date).toISOString().split('T')[0];
    if (!grouped.has(dateKey)) grouped.set(dateKey, []);
    grouped.get(dateKey)!.push(entry);
  }

  if (entries.length === 0) {
    return (
      <div className="bg-card ring-border/30 flex flex-col items-center gap-3 rounded-2xl py-16 ring-1">
        <Clock className="text-muted-foreground h-10 w-10" />
        <span className="text-muted-foreground text-sm">{t('no_events')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from(grouped.entries()).map(([dateKey, dayEntries]) => (
        <div key={dateKey} className="bg-card ring-border/30 overflow-hidden rounded-2xl ring-1">
          <div className="border-border/30 bg-muted/20 border-b px-4 py-2">
            <span className="text-sm font-semibold">
              {new Date(dateKey + 'T00:00:00').toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
          </div>
          <div className="divide-border/20 divide-y">
            {dayEntries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => onEntryClick(entry)}
                className="hover:bg-muted/30 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
              >
                <div className="text-muted-foreground w-20 shrink-0 text-xs font-bold tabular-nums">
                  {entry.startTime} – {entry.endTime}
                </div>
                <div
                  className="h-5 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color ?? '#94a3b8' }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.title}</p>
                  {entry.description && (
                    <p className="text-muted-foreground truncate text-xs">{entry.description}</p>
                  )}
                </div>
                {entry.isAiGenerated && (
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                )}
                {entry.googleEventId && <Cloud className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
