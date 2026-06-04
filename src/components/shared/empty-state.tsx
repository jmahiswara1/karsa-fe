import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 py-8 text-center', className)}
    >
      <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="text-foreground text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      {action && action}
      {actionLabel && onAction && !action && (
        <button
          onClick={onAction}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-1')}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
