'use client';

import { Clock, Sparkles } from 'lucide-react';
import type { PlannerEntry } from '@/hooks/use-planner';
import { cn } from '@/lib/utils';

interface TimeBlockProps {
  entry: PlannerEntry;
  onClick: (entry: PlannerEntry) => void;
  compact?: boolean;
}

export function TimeBlock({ entry, onClick, compact }: TimeBlockProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(entry)}
      className={cn(
        'group hover:ring-primary/30 block w-full rounded-lg px-2 py-1.5 text-left transition-all hover:shadow-md hover:ring-2',
        compact ? 'py-1 text-[10px] leading-tight' : 'text-xs',
      )}
      style={{
        backgroundColor: entry.color ? `${entry.color}18` : 'rgb(99 102 241 / 0.08)',
        borderLeft: entry.color ? `3px solid ${entry.color}` : '3px solid rgb(99 102 241 / 0.3)',
      }}
      title={entry.isAiGenerated && entry.aiReason ? entry.aiReason : undefined}
    >
      <div className="flex items-start justify-between gap-1">
        <span
          className={cn('truncate font-semibold', compact ? 'text-[10px]' : 'text-xs')}
          style={{ color: entry.color || 'rgb(99 102 241)' }}
        >
          {entry.title}
        </span>
        {entry.isAiGenerated && (
          <Sparkles className="mt-0.5 h-2.5 w-2.5 shrink-0 text-violet-400" />
        )}
      </div>
      {!compact && (
        <div className="text-muted-foreground mt-1 flex items-center gap-1 text-[10px]">
          <Clock className="h-2.5 w-2.5" />
          {entry.startTime} - {entry.endTime}
        </div>
      )}
    </button>
  );
}
