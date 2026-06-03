import { cn } from '@/lib/utils';

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string; dot: string }> = {
  TODO: {
    label: 'Todo',
    className: 'bg-slate-100 text-slate-600 ring-slate-200',
    dot: 'bg-slate-400',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-700 ring-blue-200',
    dot: 'bg-blue-500',
  },
  DONE: {
    label: 'Done',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    className: 'bg-slate-100 text-slate-400 ring-slate-200',
    dot: 'bg-slate-300',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        config.className,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      <span className={status === 'CANCELLED' ? 'line-through' : ''}>{config.label}</span>
    </span>
  );
}
