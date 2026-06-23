'use client';

import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { SkeletonGrid } from '@/components/shared/SkeletonGrid';
import { EmptyState } from '@/components/shared/empty-state';
import { NoteCard } from './NoteCard';
import { FolderCard } from './FolderCard';
import type { Note } from '@/hooks/use-notes';
import type { NoteFolder } from '@/hooks/use-note-folders';

interface NotesContentProps {
  isLoading: boolean;
  isLoadingFolders: boolean;
  notes: Note[];
  currentFolders: NoteFolder[] | undefined;
  hasFilters: boolean;
  onEditNote: (note: Note) => void;
  onDeleteNote: (note: Note) => void;
  onConvertToTask: (note: Note) => void;
  onOpenFolder: (folder: NoteFolder) => void;
  onEditFolder: (folder: NoteFolder) => void;
  onDeleteFolder: (folder: NoteFolder) => void;
  onCreateNote: () => void;
}

export function NotesContent({
  isLoading,
  isLoadingFolders,
  notes,
  currentFolders,
  hasFilters,
  onEditNote,
  onDeleteNote,
  onConvertToTask,
  onOpenFolder,
  onEditFolder,
  onDeleteFolder,
  onCreateNote,
}: NotesContentProps) {
  const t = useTranslations('Notes');
  const showFolders =
    !isLoadingFolders && !!currentFolders && currentFolders.length > 0 && !hasFilters;

  return (
    <div>
      {/* Folders */}
      {showFolders && (
        <div className="mb-6">
          <h4 className="text-muted-foreground mb-3 text-sm font-semibold">Folders</h4>
          <SortableContext
            items={currentFolders!.map((f) => `folder-${f.id}`)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentFolders!.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => onOpenFolder(folder)}
                  onEdit={() => onEditFolder(folder)}
                  onDelete={() => onDeleteFolder(folder)}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      )}

      {/* Notes */}
      <div>
        {!hasFilters && currentFolders && currentFolders.length > 0 && (
          <h4 className="text-muted-foreground mb-3 text-sm font-semibold">Files</h4>
        )}
        {isLoading ? (
          <SkeletonGrid count={8} variant="note" />
        ) : notes.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={
              hasFilters
                ? t('no_results')
                : currentFolders?.length
                  ? 'No files in this folder'
                  : t('no_notes')
            }
            description={hasFilters ? t('no_results_desc') : t('no_notes_desc')}
            actionLabel={!hasFilters ? t('create_note') : undefined}
            onAction={!hasFilters ? onCreateNote : undefined}
          />
        ) : (
          <SortableContext items={notes.map((n) => n.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={index}
                  onEdit={onEditNote}
                  onDelete={onDeleteNote}
                  onConvertToTask={onConvertToTask}
                  onClick={onEditNote}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}
