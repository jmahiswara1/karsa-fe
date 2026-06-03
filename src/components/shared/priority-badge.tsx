import { cn } from '@/lib/utils';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityConfig: Record<Priority, { label: string; className: string; dot: string }> = {
  LOW: {
    label: 'Low',
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
    dot: 'bg-slate-400',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-400',
  },
  HIGH: {
    label: 'High',
    className: 'bg-orange-50 text-orange-700 ring-orange-200',
    dot: 'bg-orange-500',
  },
  URGENT: {
    label: 'Urgent',
    className: 'bg-red-50 text-red-700 ring-red-200',
    dot: 'bg-red-500',
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        config.className,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  );
}
