'use client';

import { ChevronRight } from 'lucide-react';
import { DroppableBreadcrumbItem } from './DroppableBreadcrumbItem';

interface Crumb {
  id: string;
  name: string;
}

interface NotesBreadcrumbsProps {
  currentFolderId: string | null;
  folderStack: Crumb[];
  onNavigateRoot: () => void;
  onNavigateCrumb: (index: number, crumb: Crumb) => void;
}

export function NotesBreadcrumbs({
  currentFolderId,
  folderStack,
  onNavigateRoot,
  onNavigateCrumb,
}: NotesBreadcrumbsProps) {
  return (
    <div className="text-muted-foreground border-border/40 flex flex-wrap items-center gap-2 border-b pb-2 text-sm">
      <DroppableBreadcrumbItem
        folderId={null}
        label="Notes"
        isCurrent={currentFolderId === null}
        onClick={onNavigateRoot}
      />

      {folderStack.map((crumb, index) => (
        <div key={crumb.id} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 opacity-50" />
          <DroppableBreadcrumbItem
            folderId={crumb.id}
            label={crumb.name}
            isCurrent={index === folderStack.length - 1}
            onClick={() => onNavigateCrumb(index, crumb)}
          />
        </div>
      ))}
    </div>
  );
}
