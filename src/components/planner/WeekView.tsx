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

const DAY_ABBREV = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

interface WeekViewProps {
  date: Date;
  entries: PlannerEntry[];
  onEntryClick: (entry: PlannerEntry) => void;
  onSlotClick: (date: string, hour: number) => void;
  onEntryDrop?: (entryId: string, newDate: string, newHour: number) => void;
}

export function WeekView({ date, entries, onEntryClick, onSlotClick, onEntryDrop }: WeekViewProps) {
  const days = getWeekDays(date);
  const today = new Date();
  const todayStr = today.toDateString();
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const nowPercent = ((nowMinutes - START_HOUR * 60) / TOTAL_MINUTES) * 100;

  // Index entries by date string
  const byDate = entries.reduce<Record<string, PlannerEntry[]>>((acc, e) => {
    const ds = formatLocalDate(new Date(e.date));
    if (!acc[ds]) acc[ds] = [];
    acc[ds].push(e);
    return acc;
  }, {});

  return (
    <div className="border-border/40 bg-card overflow-auto rounded-2xl border">
      {/* Day headers */}
      <div className="border-border/30 bg-card sticky top-0 z-20 flex border-b">
        <div className="border-border/20 w-14 shrink-0 border-r" />
        <div className="grid flex-1 grid-cols-7">
          {days.map((d, i) => {
            const isT = d.toDateString() === todayStr;
            const ds = formatLocalDate(d);
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
      </div>

      {/* Timeline container */}
      <div
        className="relative flex"
        style={{ height: `${TOTAL_MINUTES * 1.2}px`, minHeight: '600px' }}
      >
        {/* Time labels */}
        <div className="border-border/20 bg-card relative z-10 w-14 shrink-0 border-r">
          {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
            const hour = START_HOUR + i;
            const topPct = ((i * 60) / TOTAL_MINUTES) * 100;
            return (
              <div
                key={hour}
                className="absolute w-full -translate-y-1/2 pr-2 text-right"
                style={{ top: `${topPct}%` }}
              >
                <span className="text-muted-foreground/50 text-[10px] leading-none font-medium tabular-nums">
                  {String(hour).padStart(2, '0')}:00
                </span>
              </div>
            );
          })}
        </div>

        {/* Grid and Columns */}
        <div className="relative grid flex-1 grid-cols-7">
          {/* Horizontal grid lines */}
          {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
            const topPct = ((i * 60) / TOTAL_MINUTES) * 100;
            return (
              <div
                key={`line-${i}`}
                className="border-border/10 pointer-events-none absolute left-0 z-0 w-full border-b"
                style={{ top: `${topPct}%` }}
              />
            );
          })}

          {/* Day columns */}
          {days.map((d) => {
            const ds = formatLocalDate(d);
            const isT = d.toDateString() === todayStr;
            const dayEntries = byDate[ds] || [];

            // Overlap detection
            const sortedEntries = [...dayEntries].sort(
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

            return (
              <div
                key={ds}
                className={cn(
                  'border-border/10 relative border-r last:border-r-0',
                  isT && 'bg-primary/[0.02]',
                )}
              >
                {/* Current time indicator line for today */}
                {isT && nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60 && (
                  <div
                    className="absolute left-0 z-30 flex w-full items-center"
                    style={{ top: `${nowPercent}%` }}
                  >
                    <div className="bg-primary h-2 w-2 -translate-x-1 rounded-full" />
                    <div className="bg-primary h-[2px] flex-1" />
                  </div>
                )}

                {/* Drop zones & Click zones for empty slots */}
                {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => {
                  const hour = START_HOUR + i;
                  const topPct = ((i * 60) / TOTAL_MINUTES) * 100;
                  const heightPct = (60 / TOTAL_MINUTES) * 100;
                  return (
                    <div
                      key={hour}
                      className="group absolute z-10 w-full"
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
                          onEntryDrop(entryId, ds, hour);
                        }
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onSlotClick(ds, hour)}
                        className="bg-muted/5 hover:border-primary/40 hover:bg-primary/5 group-hover:border-border/40 absolute inset-0.5 flex items-center justify-end rounded border border-dashed border-transparent pr-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Plus className="text-muted-foreground/50 h-4 w-4" />
                      </button>
                    </div>
                  );
                })}

                {/* Render entries */}
                {overlappingGroups.map((group) => {
                  return group.map((entry, idx) => {
                    const startMin = timeToMinutes(entry.startTime);
                    const endMin = timeToMinutes(entry.endTime);

                    const visibleStart = Math.max(startMin, START_HOUR * 60);
                    const visibleEnd = Math.min(endMin, END_HOUR * 60);
                    const visibleDuration = Math.max(visibleEnd - visibleStart, 20);

                    const topPct = ((visibleStart - START_HOUR * 60) / TOTAL_MINUTES) * 100;
                    const heightPct = (visibleDuration / TOTAL_MINUTES) * 100;

                    // Cascading layout logic
                    const leftOffset = idx * 6; // 6px shift right per overlap
                    const topOffset = idx * 4; // 4px shift down per overlap
                    const zIndex = 20 + idx;

                    return (
                      <div
                        key={entry.id}
                        className="absolute px-0.5 py-0.5 transition-all duration-200 [&:hover]:!left-[2px] [&:hover]:!z-50 [&:hover]:!w-[calc(100%-4px)]"
                        style={{
                          top: `calc(${topPct}% + ${topOffset}px)`,
                          height: `calc(${heightPct}% - ${topOffset}px)`,
                          minHeight: '28px',
                          left: `${leftOffset}px`,
                          width: `calc(100% - ${leftOffset + 28}px)`,
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
                            onEntryDrop(entryId, ds, h);
                          }
                        }}
                      >
                        <div className="bg-background h-full w-full rounded-lg shadow-sm">
                          <TimeBlock entry={entry} onClick={onEntryClick} />
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
