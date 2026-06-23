'use client';

import { useTranslations } from 'next-intl';
import { formatLocalDate } from '@/lib/date-utils';
import type { PlannerEntry } from '@/hooks/use-planner';
import { cn } from '@/lib/utils';

interface WeekViewProps {
  date: Date;
  entries: PlannerEntry[];
  onEntryClick: (entry: PlannerEntry) => void;
  onSlotClick: (dateStr: string, hour: number) => void;
  onEntryDrop?: (entryId: string, newDate: string, newHour: number) => void;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6);

function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function WeekView({ date, entries, onEntryClick, onSlotClick, onEntryDrop }: WeekViewProps) {
  const t = useTranslations('Calendar');
  const days = getWeekDays(date);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dateStr: string, hour: number) => {
    e.preventDefault();
    const entryId = e.dataTransfer.getData('text/planner-entry-id');
    if (entryId && onEntryDrop) {
      onEntryDrop(entryId, dateStr, hour);
    }
  };

  return (
    <div className="bg-card ring-border/30 overflow-hidden rounded-2xl ring-1">
      {/* Week header */}
      <div className="border-border/30 grid grid-cols-8 border-b">
        <div className="border-border/20 border-r p-2" />
        {days.map((day) => {
          const isToday = formatLocalDate(day) === formatLocalDate(new Date());
          return (
            <div
              key={day.toISOString()}
              className={cn('border-border/20 border-r p-2 text-center', isToday && 'bg-primary/5')}
            >
              <p className="text-muted-foreground text-[10px] font-medium uppercase">
                {day.toLocaleDateString('id-ID', { weekday: 'short' })}
              </p>
              <p className={cn('text-sm font-bold', isToday && 'text-primary')}>{day.getDate()}</p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="overflow-x-auto">
        {HOURS.map((hour) => {
          const hourStr = String(hour).padStart(2, '0');
          return (
            <div key={hour} className="border-border/20 grid grid-cols-8 border-b last:border-b-0">
              <div className="text-muted-foreground border-border/20 flex h-12 items-center justify-end border-r pr-2 text-[10px] font-medium tabular-nums">
                {hourStr}:00
              </div>
              {days.map((day) => {
                const dateStr = formatLocalDate(day);
                const slotEntries = entries.filter((e) => {
                  const entryDate =
                    typeof e.date === 'string'
                      ? e.date.split('T')[0]
                      : new Date(e.date).toISOString().split('T')[0];
                  return entryDate === dateStr && parseInt(e.startTime.split(':')[0], 10) === hour;
                });
                const isToday = dateStr === formatLocalDate(new Date());

                return (
                  <div
                    key={`${dateStr}-${hour}`}
                    className={cn(
                      'border-border/20 hover:bg-muted/30 relative flex h-12 cursor-pointer items-center border-r px-1 transition-colors',
                      isToday && 'bg-primary/5',
                    )}
                    onClick={() => onSlotClick(dateStr, hour)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dateStr, hour)}
                  >
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
                        className="hover:ring-primary/30 w-full truncate rounded px-1 py-0.5 text-[10px] font-medium hover:ring-1"
                        style={{
                          backgroundColor: entry.color ? `${entry.color}20` : undefined,
                          borderLeft: entry.color ? `2px solid ${entry.color}` : undefined,
                        }}
                      >
                        {entry.title}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
