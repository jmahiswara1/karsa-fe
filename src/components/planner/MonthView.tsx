'use client';

import { formatLocalDate } from '@/lib/date-utils';
import type { PlannerEntry } from '@/hooks/use-planner';
import { cn } from '@/lib/utils';

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days: (Date | null)[] = [];

  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  return days;
}

function formatDateStr(d: Date): string {
  return formatLocalDate(d);
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface MonthViewProps {
  date: Date;
  entries: PlannerEntry[];
  onDayClick: (date: Date) => void;
}

export function MonthView({ date, entries, onDayClick }: MonthViewProps) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const days = getMonthDays(year, month);
  const todayStr = new Date().toDateString();

  const entriesByDate = entries.reduce<Record<string, PlannerEntry[]>>((acc, e) => {
    const d = formatDateStr(new Date(e.date));
    if (!acc[d]) acc[d] = [];
    acc[d].push(e);
    return acc;
  }, {});

  return (
    <div className="border-border/40 bg-card overflow-hidden rounded-2xl border">
      {/* Day name headers */}
      <div className="border-border/30 bg-muted/20 grid grid-cols-7 border-b">
        {DAY_NAMES.map((name, i) => (
          <div
            key={name}
            className={cn(
              'text-muted-foreground px-3 py-3 text-center text-[11px] font-bold tracking-wider uppercase',
              i > 0 && 'border-border/20 border-l',
            )}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid auto-rows-fr grid-cols-7">
        {days.map((d, i) => {
          const isPadding = d === null;
          if (isPadding) {
            return (
              <div key={`pad-${i}`} className="border-border/10 bg-muted/5 min-h-[100px] border" />
            );
          }

          const day = d as Date;
          const ds = formatDateStr(day);
          const dayEntries = entriesByDate[ds] || [];
          const isToday = day.toDateString() === todayStr;

          return (
            <button
              key={ds}
              type="button"
              onClick={() => onDayClick(day)}
              className={cn(
                'border-border/10 hover:bg-muted/20 min-h-[100px] border p-2 text-left transition-colors',
                isToday && 'bg-primary/[0.04] ring-primary/10 ring-1 ring-inset',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                  isToday ? 'bg-primary text-primary-foreground' : 'text-foreground',
                )}
              >
                {day.getDate()}
              </span>

              <div className="mt-1 space-y-0.5">
                {dayEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="flex min-w-0 items-center gap-1.5">
                    <div
                      className="h-2 w-2 shrink-0 rounded-sm"
                      style={{ backgroundColor: entry.color || '#818cf8' }}
                    />
                    <span className="text-muted-foreground truncate text-[11px]">
                      {entry.title}
                    </span>
                  </div>
                ))}
                {dayEntries.length > 3 && (
                  <span className="text-muted-foreground/60 pl-3.5 text-[10px] font-medium">
                    +{dayEntries.length - 3} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
