'use client';

import { useTranslations } from 'next-intl';
import { PageIntro } from '@/components/shared/page-header';
import { NotesToolbar } from '@/components/notes/NotesToolbar';
import { NotesBreadcrumbs } from '@/components/notes/NotesBreadcrumbs';
import { NotesContent } from '@/components/notes/NotesContent';
import { NotesPagination } from '@/components/notes/NotesPagination';
import { NotesDialogs } from '@/components/notes/NotesDialogs';
import { useNotePageState } from '@/hooks/use-note-page-state';
import { useNoteDragDrop } from '@/hooks/use-note-drag-drop';
import { DndContext, closestCenter } from '@dnd-kit/core';

export default function NotesPage() {
  const tPages = useTranslations('Pages');
  const state = useNotePageState();

  const { sensors, handleDragEnd, optimisticNotes } = useNoteDragDrop({
    notes: state.notes,
    currentFolderId: state.currentFolderId,
    page: state.page,
    limit: 12,
  });

  return (
    <div className="flex w-full flex-col space-y-6 pb-2">
      <PageIntro title={tPages('notes_title')} subtitle={tPages('notes_desc')} />

      <NotesToolbar
        search={state.search}
        onSearchChange={state.onSearchChange}
        projectId={state.projectId}
        onProjectChange={state.setProjectId}
        hasFilters={state.hasFilters}
        onClear={state.clearFilters}
        projects={state.projects}
        currentFolderId={state.currentFolderId}
        onCreateFolder={state.handleCreateFolderClick}
        onCreateNote={state.handleCreateNote}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <NotesBreadcrumbs
          currentFolderId={state.currentFolderId}
          folderStack={state.folderStack}
          onNavigateRoot={state.navigateToRoot}
          onNavigateCrumb={state.navigateToCrumb}
        />

        <NotesContent
          isLoading={state.isLoading}
          isLoadingFolders={state.isLoadingFolders}
          notes={optimisticNotes}
          currentFolders={state.currentFolders}
          hasFilters={state.hasFilters}
          onEditNote={state.handleEditNote}
          onDeleteNote={state.handleDeleteNote}
          onConvertToTask={state.handleConvertToTask}
          onOpenFolder={state.navigateToFolder}
          onEditFolder={state.handleEditFolder}
          onDeleteFolder={state.handleDeleteFolder}
          onCreateNote={state.handleCreateNote}
        />
      </DndContext>

      <NotesPagination
        page={state.page}
        totalPages={state.totalPages}
        onPageChange={state.setPage}
      />

      <NotesDialogs
        noteDialogOpen={state.noteDialogOpen}
        onNoteDialogOpenChange={state.setNoteDialogOpen}
        editingNote={state.editingNote}
        defaultProjectId={state.projectId || undefined}
        defaultFolderId={state.currentFolderId || undefined}
        folderDialogOpen={state.folderDialogOpen}
        onFolderDialogOpenChange={state.setFolderDialogOpen}
        editingFolder={state.editingFolder}
        createFolderParentId={state.createFolderParentId}
      />
    </div>
  );
}
