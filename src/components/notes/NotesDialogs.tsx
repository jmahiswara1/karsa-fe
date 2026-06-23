'use client';

import { NoteDialog } from './NoteDialog';
import { FolderDialog } from './FolderDialog';
import type { Note } from '@/hooks/use-notes';
import type { NoteFolder } from '@/hooks/use-note-folders';

interface NotesDialogsProps {
  noteDialogOpen: boolean;
  onNoteDialogOpenChange: (open: boolean) => void;
  editingNote: Note | null;
  defaultProjectId?: string;
  defaultFolderId?: string;

  folderDialogOpen: boolean;
  onFolderDialogOpenChange: (open: boolean) => void;
  editingFolder: NoteFolder | null;
  createFolderParentId: string | null;
}

export function NotesDialogs({
  noteDialogOpen,
  onNoteDialogOpenChange,
  editingNote,
  defaultProjectId,
  defaultFolderId,
  folderDialogOpen,
  onFolderDialogOpenChange,
  editingFolder,
  createFolderParentId,
}: NotesDialogsProps) {
  return (
    <>
      <NoteDialog
        open={noteDialogOpen}
        onOpenChange={onNoteDialogOpenChange}
        note={editingNote}
        defaultProjectId={defaultProjectId}
        defaultFolderId={defaultFolderId}
      />
      <FolderDialog
        open={folderDialogOpen}
        onOpenChange={onFolderDialogOpenChange}
        folder={editingFolder}
        parentId={createFolderParentId}
      />
    </>
  );
}
