'use client';

import { Plus } from 'lucide-react';
import type { PlannerEntry } from '@/hooks/use-planner';
import { TimeBlock } from './TimeBlock';
import { cn } from '@/lib/utils';

const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 06:00-22:00

function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = 1
  start.setDate(start.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

const DAY_ABBREV = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

interface WeekViewProps {
  date: Date;
  entries: PlannerEntry[];
  onEntryClick: (entry: PlannerEntry) => void;
  onSlotClick: (date: string, hour: number) => void;
}

export function WeekView({ date, entries, onEntryClick, onSlotClick }: WeekViewProps) {
  const days = getWeekDays(date);
  const today = new Date();
  const todayStr = today.toDateString();
  const nowHour = today.getHours();

  // Index entries by date string
  const byDate = entries.reduce<Record<string, PlannerEntry[]>>((acc, e) => {
    const ds = formatDateStr(new Date(e.date));
    if (!acc[ds]) acc[ds] = [];
    acc[ds].push(e);
    return acc;
  }, {});

  return (
    <div className="border-border/40 bg-card overflow-auto rounded-2xl border">
      {/* Day headers */}
      <div className="border-border/30 bg-card sticky top-0 z-20 grid grid-cols-8 border-b">
        <div className="border-border/20 w-14 shrink-0 border-r" />
        {days.map((d, i) => {
          const isT = d.toDateString() === todayStr;
          const ds = formatDateStr(d);
          const count = (byDate[ds] || []).length;
          return (
            <div
              key={ds}
              className={cn(
                'border-border/20 flex flex-col items-center justify-center border-r px-1 py-2.5 last:border-r-0',
                isT && 'bg-primary/5',
              )}
            >
              <span className="text-muted-foreground text-[10px] font-bold tracking-wider">
                {DAY_ABBREV[i]}
              </span>
              <span
                className={cn(
                  'mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold',
                  isT ? 'bg-primary text-primary-foreground' : 'text-foreground',
                )}
              >
                {d.getDate()}
              </span>
              {count > 0 && (
                <span className="text-muted-foreground/60 mt-0.5 text-[9px] font-medium">
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Time rows */}
      <div>
        {HOURS.map((hour) => {
          const currentRow =
            todayStr === days.find((d) => d.toDateString() === todayStr)?.toDateString() &&
            hour === nowHour;

          return (
            <div
              key={hour}
              className={cn(
                'border-border/10 grid min-h-[56px] grid-cols-8 border-b',
                currentRow && 'bg-primary/[0.02]',
              )}
            >
              {/* Time label */}
              <div className="border-border/20 w-14 shrink-0 border-r py-1.5 pr-2 text-right">
                <span
                  className={cn(
                    'text-[10px] leading-none font-medium tabular-nums',
                    currentRow ? 'text-primary font-bold' : 'text-muted-foreground/50',
                  )}
                >
                  {String(hour).padStart(2, '0')}:00
                </span>
              </div>

              {/* Day columns */}
              {days.map((d) => {
                const ds = formatDateStr(d);
                const isT = d.toDateString() === todayStr;
                const dayEntries = (byDate[ds] || []).filter((e) => {
                  const [h] = e.startTime.split(':').map(Number);
                  return h === hour;
                });

                return (
                  <div
                    key={ds}
                    className={cn(
                      'group border-border/10 relative border-r p-0.5 last:border-r-0',
                      isT && 'bg-primary/[0.01]',
                    )}
                  >
                    {/* + button - absolute overlay on hover */}
                    <button
                      type="button"
                      onClick={() => onSlotClick(ds, hour)}
                      className="border-border/20 bg-muted/5 hover:border-primary/30 absolute inset-0.5 z-10 flex items-center justify-center rounded border border-dashed opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Plus className="text-muted-foreground/40 h-3 w-3" />
                    </button>

                    {/* Blocks */}
                    <div className="relative z-0 space-y-0.5">
                      {dayEntries.map((entry) => (
                        <TimeBlock key={entry.id} entry={entry} onClick={onEntryClick} compact />
                      ))}
                    </div>
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
