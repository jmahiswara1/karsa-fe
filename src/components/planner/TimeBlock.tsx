'use client';

import { Clock, Sparkles } from 'lucide-react';
import type { PlannerEntry } from '@/hooks/use-planner';
import { cn } from '@/lib/utils';

interface TimeBlockProps {
  entry: PlannerEntry;
  onClick: (entry: PlannerEntry) => void;
  showTime?: boolean;
}

export function TimeBlock({ entry, onClick, showTime }: TimeBlockProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/planner-entry-id', entry.id);
    e.dataTransfer.setData('text/planner-entry-date', String(entry.date));
    const target = e.currentTarget as HTMLElement;
    requestAnimationFrame(() => {
      target.classList.add('opacity-50', 'ring-2', 'ring-primary');
    });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('opacity-50', 'ring-2', 'ring-primary');
  };

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick(entry)}
      className={cn(
        'group hover:ring-primary/30 block h-full w-full cursor-grab overflow-hidden rounded-lg px-2 py-1 text-left text-xs transition-all hover:shadow-md hover:ring-2 active:cursor-grabbing',
      )}
      style={{
        backgroundColor: entry.color ? `${entry.color}18` : 'rgb(99 102 241 / 0.08)',
        borderLeft: entry.color ? `3px solid ${entry.color}` : '3px solid rgb(99 102 241 / 0.3)',
      }}
      title={[
        entry.isAiGenerated && entry.aiReason ? entry.aiReason : null,
        `${entry.startTime} - ${entry.endTime}`,
      ]
        .filter(Boolean)
        .join(' | ')}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className="truncate text-xs font-semibold"
          style={{ color: entry.color || 'rgb(99 102 241)' }}
        >
          {entry.title}
        </span>
        {entry.isAiGenerated && (
          <Sparkles className="mt-0.5 h-2.5 w-2.5 shrink-0 text-violet-400" />
        )}
      </div>
      {showTime && (
        <div className="text-muted-foreground mt-0.5 flex items-center gap-1 overflow-hidden text-[10px] whitespace-nowrap">
          <Clock className="h-2.5 w-2.5 shrink-0" />
          {entry.startTime} - {entry.endTime}
        </div>
      )}
    </button>
  );
}
