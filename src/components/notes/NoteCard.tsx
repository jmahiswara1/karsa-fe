'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, MoreHorizontal, Trash2, Pencil, Folder, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Note } from '@/hooks/use-notes';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NoteCardProps {
  note: Note;
  index: number;
  onEdit: (note: Note) => void;
  onDelete: (note: Note) => void;
  onConvertToTask: (note: Note) => void;
  onClick: (note: Note) => void;
}

function timeAgo(date: Date, locale: string): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  
  const isId = locale === 'id';
  
  if (mins < 60) return isId ? `${mins}m yang lalu` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return isId ? `${hrs}j yang lalu` : `${hrs}h ago`;
  return isId ? `${Math.floor(hrs / 24)}h yang lalu` : `${Math.floor(hrs / 24)}d ago`;
}

export function NoteCard({ note, index, onEdit, onDelete, onConvertToTask, onClick }: NoteCardProps) {
  const t = useTranslations('Notes');
  const isId = t('create') === 'Buat';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: note.id,
    data: {
      type: 'Note',
      note,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex flex-col h-full rounded-xl border border-border/50 bg-card p-5 cursor-grab active:cursor-grabbing transition-all duration-200 touch-none",
        isDragging ? "shadow-xl border-primary ring-1 ring-primary" : "hover:border-border hover:shadow-md hover:-translate-y-0.5"
      )}
      onClick={() => onClick(note)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0 bg-blue-500/10">
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold leading-tight truncate">{note.title}</h3>
            <span className="text-[11px] font-medium text-muted-foreground">
              {timeAgo(new Date(note.updatedAt), isId ? 'id' : 'en')}
            </span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking menu
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all text-muted-foreground outline-none cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(note); }}>
              <Pencil className="h-3.5 w-3.5 mr-2" />
              {t('edit')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onConvertToTask(note); }}>
              <ArrowRightLeft className="h-3.5 w-3.5 mr-2" />
              {t('convert_to_task')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(note); }} className="text-red-500 focus:text-red-500">
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content Preview */}
      <div className="flex-1 mb-4">
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap">
          {note.content}
        </p>
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between text-muted-foreground mt-auto pt-4 border-t border-border/40">
        <div className="flex items-center gap-2 max-w-[60%]">
          {note.project ? (
            <div className="flex items-center gap-1 text-[11px] bg-muted/50 px-2 py-1 rounded-md truncate">
              <Folder className="h-3 w-3 shrink-0" />
              <span className="truncate">{note.project.title}</span>
            </div>
          ) : (
            <div className="text-[11px] opacity-0 group-hover:opacity-100 transition-opacity">
              {t('field_no_project')}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <span className="text-[10px] font-medium uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded">
            {note.source === 'MANUAL' ? t('source_manual') : 
             note.source === 'QUICK_CAPTURE' ? t('source_quick_capture') : 
             note.source === 'AI' ? t('source_ai') : note.source}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
