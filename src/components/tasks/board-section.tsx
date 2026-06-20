'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSectionCollapse } from '@/hooks/use-section-collapse';

interface BoardSectionProps {
  title: string;
  storageKey: string;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function BoardSection({
  title,
  storageKey,
  defaultCollapsed = false,
  children,
  action,
}: BoardSectionProps) {
  const { collapsed, toggle } = useSectionCollapse(storageKey, defaultCollapsed);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={toggle}
        className="flex items-center justify-between gap-2 px-1 py-1 rounded-md hover:bg-muted/30 transition-colors text-left group"
        aria-expanded={!collapsed}
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {action}
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-muted-foreground/70 transition-transform duration-200',
              collapsed && '-rotate-90',
            )}
          />
        </div>
      </button>
      {!collapsed && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {children}
        </div>
      )}
    </div>
  );
}
