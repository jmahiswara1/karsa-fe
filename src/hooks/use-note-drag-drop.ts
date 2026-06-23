'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useUpdateNote, useReorderNotes, type Note } from './use-notes';
import { useUpdateNoteFolder } from './use-note-folders';

interface UseNoteDragDropArgs {
  notes: Note[];
  currentFolderId: string | null;
  page: number;
  limit: number;
}

export interface NoteDragDrop {
  sensors: ReturnType<typeof useSensors>;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
  optimisticNotes: Note[];
}

/**
 * Manages drag-and-drop for the notes grid:
 * - Note → Folder: moves note (optimistic + server update).
 * - Folder → Folder: moves folder.
 * - Note → Note: reorders within current page (optimistic + server reorder).
 */
export function useNoteDragDrop({
  notes,
  currentFolderId,
  page,
  limit,
}: UseNoteDragDropArgs): NoteDragDrop {
  const updateNote = useUpdateNote();
  const reorderNotes = useReorderNotes();
  const updateFolder = useUpdateNoteFolder();

  const [optimisticNotes, setOptimisticNotes] = useState<Note[]>(notes);

  // Sync optimistic state when the server data changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOptimisticNotes(notes);
  }, [notes]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const isOverFolder = over.data.current?.type === 'Folder';
    if (isOverFolder && over.data.current?.folderId !== undefined) {
      const targetFolderId = over.data.current.folderId as string | null;

      if (active.data.current?.type === 'Note') {
        const noteId = active.id as string;

        if (
          targetFolderId === currentFolderId ||
          (targetFolderId === null && currentFolderId === null)
        )
          return;

        setOptimisticNotes((items) => items.filter((n) => n.id !== noteId));

        try {
          const realFolderId =
            targetFolderId === 'folder-root'
              ? null
              : targetFolderId?.replace('folder-', '') || null;
          await updateNote.mutateAsync({ id: noteId, folderId: realFolderId });
          toast.success('Note moved to folder');
        } catch {
          toast.error('Failed to move note');
          setOptimisticNotes(notes);
        }
        return;
      }

      if (active.data.current?.type === 'Folder') {
        const sourceFolderId = (active.id as string).replace('folder-', '');

        if (sourceFolderId === targetFolderId?.replace('folder-', '')) return;
        if (
          targetFolderId === currentFolderId ||
          (targetFolderId === null && currentFolderId === null)
        )
          return;

        try {
          const realFolderId =
            targetFolderId === 'folder-root'
              ? null
              : targetFolderId?.replace('folder-', '') || null;
          await updateFolder.mutateAsync({ id: sourceFolderId, data: { parentId: realFolderId } });
          toast.success('Folder moved');
        } catch {
          toast.error('Failed to move folder');
        }
        return;
      }
    }

    if (active.id !== over.id) {
      setOptimisticNotes((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        const newArray = arrayMove(items, oldIndex, newIndex);

        const reorderPayload = newArray.map((note, idx) => ({
          id: note.id,
          order: (page - 1) * limit + idx,
        }));

        reorderNotes.mutate(reorderPayload);

        return newArray;
      });
    }
  };

  return { sensors, handleDragEnd, optimisticNotes };
}
