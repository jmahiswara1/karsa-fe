'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type SkeletonVariant = 'note' | 'project' | 'task-column' | 'task' | 'simple';

interface SkeletonGridProps {
  count?: number;
  variant?: SkeletonVariant;
  columns?: string;
  className?: string;
}

const DEFAULT_GRID = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

function NoteSkeleton() {
  return (
    <div className="border-border/50 flex h-[200px] flex-col space-y-3 rounded-xl border p-5">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="mt-2 flex-1 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="mt-auto flex justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="border-border/50 space-y-3 rounded-xl border p-5">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

function TaskColumnSkeleton() {
  return (
    <div className="bg-muted/40 flex h-full w-80 shrink-0 flex-col gap-3 rounded-xl p-3.5">
      <Skeleton className="mb-2 h-6 w-1/3" />
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-28 w-full rounded-xl" />
    </div>
  );
}

const VARIANTS: Record<SkeletonVariant, () => React.ReactElement> = {
  note: NoteSkeleton,
  project: ProjectSkeleton,
  'task-column': TaskColumnSkeleton,
  task: () => <Skeleton className="h-16 w-full rounded-xl" />,
  simple: () => <Skeleton className="h-24 w-full rounded-xl" />,
};

export function SkeletonGrid({
  count = 6,
  variant = 'note',
  columns = DEFAULT_GRID,
  className,
}: SkeletonGridProps) {
  const Item = VARIANTS[variant];
  const isFlex = variant === 'task-column' || variant === 'task';

  if (isFlex) {
    return (
      <div className={cn('flex gap-6', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Item key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-5', columns, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Item key={i} />
      ))}
    </div>
  );
}
