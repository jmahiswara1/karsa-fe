'use client';

import { Folder, MoreVertical, Pencil, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface FolderCardProps {
  folder: { id: string; name: string };
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function FolderCard({ folder, onClick, onEdit, onDelete }: FolderCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `folder-${folder.id}`,
    data: {
      type: 'Folder',
      folderId: folder.id,
      folder,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative flex cursor-pointer items-center justify-between rounded-xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm',
        isDragging && 'z-50 shadow-lg',
      )}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500 dark:bg-blue-500/10">
          <Folder className="h-5 w-5 fill-current opacity-20" />
        </div>
        <span className="truncate font-medium text-foreground">{folder.name}</span>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger 
            className="h-8 w-8 inline-flex items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted outline-none"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 p-1.5 rounded-xl">
            <DropdownMenuItem 
              onClick={onEdit}
              className="rounded-lg px-2.5 py-2 cursor-pointer focus:bg-slate-100 dark:focus:bg-slate-800"
            >
              <Pencil className="mr-3 h-4 w-4 text-foreground/70" />
              <span className="font-medium text-foreground">Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="rounded-lg px-2.5 py-2 cursor-pointer focus:bg-blue-50/80 dark:focus:bg-slate-800/80 mt-1"
            >
              <Trash className="mr-3 h-4 w-4 text-foreground/70" />
              <span className="font-medium text-red-500 dark:text-red-400">Hapus</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
