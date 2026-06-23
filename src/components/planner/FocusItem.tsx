'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslations } from 'next-intl';
import { GripVertical, Sparkles, Clock, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlannerEntry, PlannerCategory } from '@/hooks/use-planner';

const CATEGORY_STYLES: Record<PlannerCategory, { color: string; bg: string }> = {
  FOCUS: { color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-900/20' },
  BREAK: {
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  MEETING: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  PERSONAL: {
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  OTHER: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-900/20' },
};

function calcDuration(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return eh * 60 + em - (sh * 60 + sm);
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

interface FocusItemProps {
  entry: PlannerEntry;
  index: number;
  onClick: (entry: PlannerEntry) => void;
}

export function FocusItem({ entry, index, onClick }: FocusItemProps) {
  const t = useTranslations('Focus');
  const cat = entry.category ?? 'FOCUS';
  const style = CATEGORY_STYLES[cat] ?? CATEGORY_STYLES.FOCUS;
  const duration = calcDuration(entry.startTime, entry.endTime);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: entry.id,
  });

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      className={cn(
        'group border-border/40 bg-card flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm transition-all',
        'hover:border-primary/20 hover:shadow-md',
        isDragging && 'ring-primary/30 z-50 opacity-90 shadow-lg ring-2',
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground cursor-grab touch-none active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Index number */}
      <span className="text-muted-foreground w-5 shrink-0 text-center text-xs font-bold tabular-nums">
        {index + 1}
      </span>

      {/* Color bar */}
      <div
        className="h-6 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: entry.color ?? '#94a3b8' }}
      />

      {/* Content */}
      <button type="button" onClick={() => onClick(entry)} className="min-w-0 flex-1 text-left">
        <p className="text-foreground truncate text-sm font-semibold">{entry.title}</p>
        <div className="mt-0.5 flex items-center gap-2">
          {duration > 0 && (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {formatDuration(duration)}
            </span>
          )}
          <span
            className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', style.bg, style.color)}
          >
            {t(`category_${cat.toLowerCase()}`)}
          </span>
        </div>
      </button>

      {/* Badges */}
      <div className="flex shrink-0 items-center gap-1.5">
        {entry.isAiGenerated && <Sparkles className="h-3.5 w-3.5 text-amber-500" />}
        {entry.googleEventId && <Cloud className="h-3.5 w-3.5 text-emerald-500" />}
      </div>
    </div>
  );
}
