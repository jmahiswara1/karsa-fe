import { cn } from '@/lib/utils';

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string; dot: string }> = {
  TODO: {
    label: 'Todo',
    className: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    dot: 'bg-slate-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    dot: 'bg-blue-500',
  },
  DONE: {
    label: 'Done',
    className: 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-200',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold',
        config.className,
        className,
      )}
    >
      <span className={status === 'CANCELLED' ? 'line-through' : ''}>{config.label}</span>
    </span>
  );
}
