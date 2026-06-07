'use client';

import { formatLocalDate } from '@/lib/date-utils';
import { Plus } from 'lucide-react';
import type { PlannerEntry } from '@/hooks/use-planner';
import { TimeBlock } from './TimeBlock';
import { cn } from '@/lib/utils';

const START_HOUR = 6;
const END_HOUR = 22;
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60; // 960

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function formatDateStr(d: Date): string {
  return formatLocalDate(d);
}

interface DayViewProps {
  date: Date;
  entries: PlannerEntry[];
  onEntryClick: (entry: PlannerEntry) => void;
  onSlotClick: (date: string, hour: number) => void;
  onEntryDrop?: (entryId: string, newDate: string, newHour: number) => void;
}

export function DayView({ date, entries, onEntryClick, onSlotClick, onEntryDrop }: DayViewProps) {
  const dateStr = formatDateStr(date);
  const isToday = date.toDateString() === new Date().toDateString();
  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

  // Current time indicator position (0-100%)
  const nowPercent = ((nowMinutes - START_HOUR * 60) / TOTAL_MINUTES) * 100;

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

      {/* Timeline container */}
      <div className="relative" style={{ height: `${TOTAL_MINUTES * 0.9}px`, minHeight: '600px' }}>
        {/* Hour grid lines + slots */}
        {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
          const hour = START_HOUR + i;
          const topPct = ((i * 60) / TOTAL_MINUTES) * 100;
          const heightPct = (60 / TOTAL_MINUTES) * 100;

          return (
            <div
              key={hour}
              className="group border-border/10 absolute left-0 flex w-full border-b last:border-b-0"
              style={{ top: `${topPct}%`, height: `${heightPct}%` }}
              onDragOver={(e) => {
                if (onEntryDrop) {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }
              }}
              onDrop={(e) => {
                if (!onEntryDrop) return;
                e.preventDefault();
                const entryId = e.dataTransfer.getData('text/planner-entry-id');
                if (entryId) {
                  onEntryDrop(entryId, dateStr, hour);
                }
              }}
            >
              {/* Time label */}
              <div className="w-14 shrink-0 pr-2 text-right">
                <span className="text-muted-foreground text-[10px] leading-none font-medium tabular-nums">
                  {String(hour).padStart(2, '0')}:00
                </span>
              </div>

              {/* Slot */}
              <div className="border-border/20 relative flex-1 border-l">
                {/* + button */}
                <button
                  type="button"
                  onClick={() => onSlotClick(dateStr, hour)}
                  className="border-border/20 bg-muted/5 hover:border-primary/40 hover:bg-primary/5 absolute inset-0.5 z-10 flex items-center justify-end rounded border border-dashed pr-3 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Plus className="text-muted-foreground/50 h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Entry blocks — absolutely positioned */}
        {(() => {
          const sortedEntries = [...entries].sort(
            (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
          );
          const overlappingGroups: PlannerEntry[][] = [];

          sortedEntries.forEach((entry) => {
            let placed = false;
            for (const group of overlappingGroups) {
              const lastInGroup = group[group.length - 1];
              if (timeToMinutes(entry.startTime) < timeToMinutes(lastInGroup.endTime)) {
                group.push(entry);
                placed = true;
                break;
              }
            }
            if (!placed) {
              overlappingGroups.push([entry]);
            }
          });

          return overlappingGroups.map((group) => {
            return group.map((entry, idx) => {
              const startMin = timeToMinutes(entry.startTime);
              const endMin = timeToMinutes(entry.endTime);

              // Clamp to visible range
              const visibleStart = Math.max(startMin, START_HOUR * 60);
              const visibleEnd = Math.min(endMin, END_HOUR * 60);
              const visibleDuration = Math.max(visibleEnd - visibleStart, 20);

              const topPct = ((visibleStart - START_HOUR * 60) / TOTAL_MINUTES) * 100;
              const heightPct = (visibleDuration / TOTAL_MINUTES) * 100;

              // Cascading layout logic
              const leftOffset = idx * 12; // 12px shift right per overlap
              const topOffset = idx * 4; // 4px shift down per overlap
              const zIndex = 20 + idx;

              return (
                <div
                  key={entry.id}
                  className="absolute right-1 px-0.5 py-0.5 transition-all duration-200 [&:hover]:!left-[calc(3.5rem+4px)] [&:hover]:!z-50 [&:hover]:!w-[calc(100%-3.5rem-8px)]"
                  style={{
                    top: `calc(${topPct}% + ${topOffset}px)`,
                    height: `calc(${heightPct}% - ${topOffset}px)`,
                    minHeight: '28px',
                    left: `calc(3.5rem + ${leftOffset}px)`,
                    width: `calc(100% - 3.5rem - ${leftOffset + 32}px)`,
                    zIndex,
                  }}
                  onDragOver={(e) => {
                    if (onEntryDrop) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.dataTransfer.dropEffect = 'move';
                    }
                  }}
                  onDrop={(e) => {
                    if (!onEntryDrop) return;
                    e.preventDefault();
                    e.stopPropagation();
                    const entryId = e.dataTransfer.getData('text/planner-entry-id');
                    if (entryId && entryId !== entry.id) {
                      const h = parseInt(entry.startTime.split(':')[0], 10);
                      onEntryDrop(entryId, dateStr, h);
                    }
                  }}
                >
                  <div className="bg-background h-full w-full rounded-lg shadow-sm">
                    <TimeBlock entry={entry} onClick={onEntryClick} showTime />
                  </div>
                </div>
              );
            });
          });
        })()}

        {/* Current time line */}
        {isToday && nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60 && (
          <div
            className="absolute left-0 z-30 flex w-full items-center"
            style={{ top: `${nowPercent}%` }}
          >
            <div className="bg-primary h-3 w-3 -translate-x-1.5 rounded-full" />
            <div className="bg-primary h-[2px] flex-1" />
          </div>
        )}
      </div>
    </div>
  );
}
