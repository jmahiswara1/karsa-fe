'use client';

import { Plus } from 'lucide-react';
import type { PlannerEntry } from '@/hooks/use-planner';
import { TimeBlock } from './TimeBlock';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00 - 22:00

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

interface DayViewProps {
  date: Date;
  entries: PlannerEntry[];
  onEntryClick: (entry: PlannerEntry) => void;
  onSlotClick: (date: string, hour: number) => void;
}

export function DayView({ date, entries, onEntryClick, onSlotClick }: DayViewProps) {
  const dateStr = formatDateStr(date);

  const entriesByHour = HOURS.reduce(
    (acc, hour) => {
      acc[hour] = entries.filter((e) => {
        const startMin = timeToMinutes(e.startTime);
        return startMin >= hour * 60 && startMin < (hour + 1) * 60;
      });
      return acc;
    },
    {} as Record<number, PlannerEntry[]>,
  );

  const isToday = date.toDateString() === new Date().toDateString();
  const nowHour = new Date().getHours();

  return (
    <div className="border-border/40 bg-card overflow-hidden rounded-2xl border">
      {/* All-day header */}
      <div className={cn('border-border/30 border-b px-4 py-3', isToday && 'bg-primary/5')}>
        <span className="text-foreground text-sm font-bold">
          {date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Time slots */}
      <div>
        {HOURS.map((hour) => {
          const hourEntries = entriesByHour[hour] || [];
          const currentHour = isToday && hour === nowHour;

          return (
            <div
              key={hour}
              className="group border-border/10 flex min-h-[60px] border-b last:border-b-0"
            >
              {/* Time label */}
              <div className="w-16 shrink-0 pt-2 pr-3 text-right">
                <span
                  className={cn(
                    'text-[11px] leading-none font-medium tabular-nums',
                    currentHour ? 'text-primary font-bold' : 'text-muted-foreground',
                  )}
                >
                  {String(hour).padStart(2, '0')}:00
                </span>
              </div>

              {/* Slot content */}
              <div
                className={cn(
                  'border-border/20 relative flex-1 border-l px-1 py-1',
                  currentHour && 'bg-primary/[0.03]',
                )}
              >
                {/* + button - absolute overlay, shows on hover */}
                <button
                  type="button"
                  onClick={() => onSlotClick(dateStr, hour)}
                  className="border-border/20 bg-muted/5 hover:border-primary/40 hover:bg-primary/5 absolute inset-1 z-10 flex items-center justify-center rounded-lg border border-dashed opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Plus className="text-muted-foreground/50 h-4 w-4" />
                </button>

                {/* Blocks */}
                <div className="relative z-0 space-y-1">
                  {hourEntries.map((entry) => (
                    <TimeBlock key={entry.id} entry={entry} onClick={onEntryClick} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
