'use client';

import { formatLocalDate } from '@/lib/date-utils';
import type { PlannerEntry } from '@/hooks/use-planner';
import { cn } from '@/lib/utils';

interface MonthViewProps {
  date: Date;
  entries: PlannerEntry[];
  onDayClick: (date: Date) => void;
}

function getMonthDays(date: Date): (Date | null)[] {
  const year = date.getFullYear();
  const month = date.getMonth();
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

export function MonthView({ date, entries, onDayClick }: MonthViewProps) {
  const days = getMonthDays(date);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-card ring-border/30 overflow-hidden rounded-2xl ring-1">
      {/* Header */}
      <div className="border-border/30 grid grid-cols-7 border-b">
        {weekDays.map((d) => (
          <div
            key={d}
            className="border-border/20 text-muted-foreground border-r p-2 text-center text-[10px] font-semibold uppercase last:border-r-0"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          if (!day) {
            return (
              <div
                key={`pad-${i}`}
                className="border-border/20 h-20 border-r border-b last:border-r-0"
              />
            );
          }
          const dateStr = formatLocalDate(day);
          const isToday = dateStr === formatLocalDate(new Date());
          const dayEntries = entries.filter((e) => {
            const entryDate =
              typeof e.date === 'string'
                ? e.date.split('T')[0]
                : new Date(e.date).toISOString().split('T')[0];
            return entryDate === dateStr;
          });

          return (
            <div
              key={dateStr}
              className={cn(
                'border-border/20 hover:bg-muted/30 h-20 cursor-pointer border-r border-b p-1.5 transition-colors last:border-r-0',
                isToday && 'bg-primary/5',
              )}
              onClick={() => onDayClick(day)}
            >
              <span className={cn('text-xs font-medium', isToday && 'text-primary font-bold')}>
                {day.getDate()}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {dayEntries.slice(0, 2).map((e) => (
                  <div
                    key={e.id}
                    className="truncate rounded px-1 py-0.5 text-[9px] font-medium"
                    style={{
                      backgroundColor: e.color ? `${e.color}20` : undefined,
                    }}
                  >
                    {e.title}
                  </div>
                ))}
                {dayEntries.length > 2 && (
                  <span className="text-muted-foreground text-[9px]">+{dayEntries.length - 2}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
