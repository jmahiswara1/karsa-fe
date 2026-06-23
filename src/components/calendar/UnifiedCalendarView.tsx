'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Cloud, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DayView } from '@/components/calendar/DayView';
import { WeekView } from '@/components/calendar/WeekView';
import { MonthView } from '@/components/calendar/MonthView';
import { AgendaView } from '@/components/calendar/AgendaView';
import type { PlannerEntry } from '@/hooks/use-planner';
import type { CalendarEvent } from '@/hooks/use-calendar-sync';
import type { ViewMode } from '@/components/calendar/ViewSwitcher';

type LayerMode = 'planner' | 'google' | 'both';

interface UnifiedCalendarViewProps {
  viewMode: ViewMode;
  date: Date;
  entries: PlannerEntry[];
  googleEvents: CalendarEvent[];
  onEntryClick: (entry: PlannerEntry) => void;
  onSlotClick: (dateStr: string, hour: number) => void;
  onEntryDrop?: (entryId: string, newDate: string, newHour: number) => void;
  onDayClick?: (date: Date) => void;
}

const layers: { key: LayerMode; labelKey: string }[] = [
  { key: 'planner', labelKey: 'layer_planner' },
  { key: 'google', labelKey: 'layer_google' },
  { key: 'both', labelKey: 'layer_both' },
];

export function UnifiedCalendarView({
  viewMode,
  date,
  entries,
  googleEvents,
  onEntryClick,
  onSlotClick,
  onEntryDrop,
  onDayClick,
}: UnifiedCalendarViewProps) {
  const t = useTranslations('Calendar');
  const [layerMode, setLayerMode] = useState<LayerMode>('planner');

  return (
    <div className="space-y-3">
      {/* Layer Toggle */}
      <div className="flex items-center gap-2">
        <div className="border-border/50 bg-muted/30 flex rounded-xl border p-1">
          {layers.map((layer) => (
            <button
              key={layer.key}
              type="button"
              onClick={() => setLayerMode(layer.key)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                layerMode === layer.key
                  ? 'text-foreground ring-border bg-white shadow-sm ring-1 dark:bg-slate-800'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t(layer.labelKey)}
            </button>
          ))}
        </div>
        {layerMode !== 'planner' && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <Cloud className="h-3.5 w-3.5" />
            {googleEvents.length} Google events
          </div>
        )}
      </div>

      {/* Calendar Views */}
      {layerMode === 'planner' && (
        <CalendarViewContent
          viewMode={viewMode}
          date={date}
          entries={entries}
          onEntryClick={onEntryClick}
          onSlotClick={onSlotClick}
          onEntryDrop={onEntryDrop}
          onDayClick={onDayClick}
        />
      )}

      {layerMode === 'google' && <GoogleEventsOverlay events={googleEvents} />}

      {layerMode === 'both' && (
        <div className="space-y-3">
          <CalendarViewContent
            viewMode={viewMode}
            date={date}
            entries={entries}
            onEntryClick={onEntryClick}
            onSlotClick={onSlotClick}
            onEntryDrop={onEntryDrop}
            onDayClick={onDayClick}
          />
          {googleEvents.length > 0 && (
            <div className="bg-card ring-border/30 rounded-2xl p-4 ring-1">
              <div className="mb-3 flex items-center gap-2">
                <Cloud className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold">{t('google_events')}</span>
                <span className="text-muted-foreground text-xs">({googleEvents.length})</span>
              </div>
              <div className="space-y-1.5">
                {googleEvents.map((event) => {
                  const start = event.start?.dateTime ? new Date(event.start.dateTime) : null;
                  const end = event.end?.dateTime ? new Date(event.end.dateTime) : null;

                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 rounded-lg border border-dashed border-emerald-200 bg-emerald-50/50 px-3 py-2 dark:border-emerald-800/30 dark:bg-emerald-900/10"
                    >
                      <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {event.summary ?? 'Untitled'}
                        </p>
                        {start && end && (
                          <p className="text-muted-foreground text-xs">
                            {start.toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            {start.toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                            {' – '}
                            {end.toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CalendarViewContent({
  viewMode,
  date,
  entries,
  onEntryClick,
  onSlotClick,
  onEntryDrop,
  onDayClick,
}: {
  viewMode: ViewMode;
  date: Date;
  entries: PlannerEntry[];
  onEntryClick: (entry: PlannerEntry) => void;
  onSlotClick: (dateStr: string, hour: number) => void;
  onEntryDrop?: (entryId: string, newDate: string, newHour: number) => void;
  onDayClick?: (date: Date) => void;
}) {
  if (viewMode === 'day') {
    return (
      <DayView
        date={date}
        entries={entries}
        onEntryClick={onEntryClick}
        onSlotClick={onSlotClick}
        onEntryDrop={onEntryDrop}
      />
    );
  }

  if (viewMode === 'week') {
    return (
      <WeekView
        date={date}
        entries={entries}
        onEntryClick={onEntryClick}
        onSlotClick={onSlotClick}
        onEntryDrop={onEntryDrop}
      />
    );
  }

  if (viewMode === 'month') {
    return <MonthView date={date} entries={entries} onDayClick={onDayClick ?? (() => {})} />;
  }

  return <AgendaView entries={entries} onEntryClick={onEntryClick} />;
}

function GoogleEventsOverlay({ events }: { events: CalendarEvent[] }) {
  const t = useTranslations('Calendar');

  if (events.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-3 py-16">
        <Inbox className="h-10 w-10" />
        <span className="text-sm">{t('no_google_events')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {events.map((event) => {
        const start = event.start?.dateTime ? new Date(event.start.dateTime) : null;
        const end = event.end?.dateTime ? new Date(event.end.dateTime) : null;

        return (
          <div
            key={event.id}
            className="flex items-center gap-3 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 px-4 py-3 dark:border-emerald-800/30 dark:bg-emerald-900/10"
          >
            <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{event.summary ?? 'Untitled'}</p>
              {start && end && (
                <p className="text-muted-foreground text-xs">
                  {start.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}{' '}
                  {start.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {' – '}
                  {end.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
