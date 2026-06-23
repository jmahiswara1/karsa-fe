'use client';

import { useTranslations } from 'next-intl';
import { formatLocalDate } from '@/lib/date-utils';
import type { PlannerEntry } from '@/hooks/use-planner';
import { cn } from '@/lib/utils';

interface DayViewProps {
  date: Date;
  entries: PlannerEntry[];
  onEntryClick: (entry: PlannerEntry) => void;
  onSlotClick: (dateStr: string, hour: number) => void;
  onEntryDrop?: (entryId: string, newDate: string, newHour: number) => void;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6 AM to 9 PM

export function DayView({ date, entries, onEntryClick, onSlotClick, onEntryDrop }: DayViewProps) {
  const t = useTranslations('Calendar');
  const dateStr = formatLocalDate(date);

  const dayEntries = entries.filter((e) => {
    const entryDate =
      typeof e.date === 'string'
        ? e.date.split('T')[0]
        : new Date(e.date).toISOString().split('T')[0];
    return entryDate === dateStr;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    const entryId = e.dataTransfer.getData('text/planner-entry-id');
    if (entryId && onEntryDrop) {
      onEntryDrop(entryId, dateStr, hour);
    }
  };

  return (
    <div className="bg-card ring-border/30 overflow-hidden rounded-2xl ring-1">
      {/* Day header */}
      <div className="border-border/30 flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold">
          {date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
        </span>
        <span className="text-muted-foreground text-xs">
          {dayEntries.length} {t('events')}
        </span>
      </div>

      {/* Time grid */}
      <div className="divide-border/20 divide-y">
        {HOURS.map((hour) => {
          const hourStr = String(hour).padStart(2, '0');
          const slotEntries = dayEntries.filter((e) => {
            const startHour = parseInt(e.startTime.split(':')[0], 10);
            return startHour === hour;
          });

          return (
            <div
              key={hour}
              className="group hover:bg-muted/30 flex min-h-[52px] cursor-pointer transition-colors"
              onClick={() => onSlotClick(dateStr, hour)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, hour)}
            >
              <div className="text-muted-foreground border-border/20 w-14 shrink-0 border-r py-3 pr-2 text-right text-xs font-medium tabular-nums">
                {hourStr}:00
              </div>
              <div className="min-w-0 flex-1 p-1.5">
                {slotEntries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/planner-entry-id', entry.id);
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEntryClick(entry);
                    }}
                    className={cn(
                      'w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-all',
                      'hover:ring-primary/30 hover:ring-1',
                    )}
                    style={{
                      backgroundColor: entry.color ? `${entry.color}20` : undefined,
                      borderLeft: entry.color ? `3px solid ${entry.color}` : undefined,
                    }}
                  >
                    <span className="block truncate">{entry.title}</span>
                    <span className="text-muted-foreground block text-[10px]">
                      {entry.startTime} – {entry.endTime}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
