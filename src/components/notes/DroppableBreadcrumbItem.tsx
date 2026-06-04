'use client';

import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface DroppableBreadcrumbItemProps {
  folderId: string | null;
  label: string;
  isCurrent?: boolean;
  onClick: () => void;
}

export function DroppableBreadcrumbItem({ folderId, label, isCurrent, onClick }: DroppableBreadcrumbItemProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: folderId === null ? 'folder-root' : `folder-${folderId}`,
    data: {
      type: 'Folder',
      folderId: folderId, // will be null for root
    },
  });

  return (
    <Button
      ref={setNodeRef}
      variant={isCurrent ? 'secondary' : 'ghost'}
      size="sm"
      className={cn(
        'h-7 px-2 transition-colors',
        isOver && 'bg-primary/20 text-primary border-primary/50',
        isCurrent && 'pointer-events-none'
      )}
      onClick={onClick}
    >
      {folderId === null && <Home className="h-4 w-4 mr-1.5" />}
      {label}
    </Button>
  );
}
