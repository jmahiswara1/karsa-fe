import { cn } from '@/lib/utils';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const priorityConfig: Record<Priority, { label: string; className: string; dot: string }> = {
  LOW: {
    label: 'Low',
    className: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    dot: 'bg-slate-500',
  },
  MEDIUM: {
    label: 'Medium',
    className: 'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200',
    dot: 'bg-amber-500',
  },
  HIGH: {
    label: 'High',
    className: 'bg-orange-200 text-orange-800 dark:bg-orange-800 dark:text-orange-200',
    dot: 'bg-orange-600',
  },
  URGENT: {
    label: 'Urgent',
    className: 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200',
    dot: 'bg-red-600',
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
