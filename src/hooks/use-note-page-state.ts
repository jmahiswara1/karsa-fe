'use client';

import { useCallback, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useDebouncedSearch } from './use-debounced-search';
import { useDeleteConfirm } from './use-delete-confirm';
import { useNotesQuery, useDeleteNote, type Note } from './use-notes';
import { useNoteFoldersQuery, useDeleteNoteFolder, type NoteFolder } from './use-note-folders';
import { useProjectsQuery } from './use-projects';
import { useCreateTask, useTaskColumns } from './use-tasks';
import { useDialogStore } from '@/store/dialog.store';

interface Crumb {
  id: string;
  name: string;
}

const PAGE_LIMIT = 12;

export interface NotePageState {
  // Navigation
  currentFolderId: string | null;
  folderStack: Crumb[];
  navigateToFolder: (folder: { id: string; name: string }) => void;
  navigateToCrumb: (index: number, crumb: Crumb) => void;
  navigateToRoot: () => void;

  // Search & filters
  search: string;
  debouncedSearch: string;
  onSearchChange: (value: string) => void;
  projectId: string;
  setProjectId: (id: string) => void;
  clearFilters: () => void;
  hasFilters: boolean;

  // Pagination
  page: number;
  setPage: (updater: (p: number) => number) => void;
  totalPages: number;

  // Data
  notes: Note[];
  meta: { page: number; limit: number; total: number; totalPages: number } | undefined;
  isLoading: boolean;
  currentFolders: NoteFolder[] | undefined;
  isLoadingFolders: boolean;
  projects: { id: string; title: string }[];

  // Note dialog
  noteDialogOpen: boolean;
  setNoteDialogOpen: (open: boolean) => void;
  editingNote: Note | null;
  handleCreateNote: () => void;
  handleEditNote: (note: Note) => void;

  // Folder dialog
  folderDialogOpen: boolean;
  setFolderDialogOpen: (open: boolean) => void;
  editingFolder: NoteFolder | null;
  createFolderParentId: string | null;
  handleCreateFolderClick: (parentId: string | null) => void;
  handleEditFolder: (folder: NoteFolder) => void;

  // Note actions
  handleDeleteNote: (note: Note) => void;
  handleConvertToTask: (note: Note) => void;

  // Folder actions
  handleDeleteFolder: (folder: NoteFolder) => void;
}

export function useNotePageState(): NotePageState {
  const t = useTranslations('Notes');
  const { showConfirm } = useDialogStore();
  const { confirmDelete } = useDeleteConfirm();

  const deleteNote = useDeleteNote();
  const deleteFolder = useDeleteNoteFolder();
  const createTask = useCreateTask();
  const { data: taskColumns } = useTaskColumns();

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderStack, setFolderStack] = useState<Crumb[]>([]);
  const { search, debouncedSearch, setSearch, clear: clearSearch } = useDebouncedSearch();
  const [projectId, setProjectIdState] = useState<string>('');
  const [page, setPage] = useState(1);

  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<NoteFolder | null>(null);
  const [createFolderParentId, setCreateFolderParentId] = useState<string | null>(null);

  const queryParams = useMemo(
    () => ({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(projectId && { projectId }),
      folderId: currentFolderId,
      page,
      limit: PAGE_LIMIT,
    }),
    [debouncedSearch, projectId, page, currentFolderId],
  );

  const { data, isLoading } = useNotesQuery(queryParams);
  const notes = useMemo(() => data?.data || [], [data?.data]);
  const meta = data?.meta;

  const { data: projectsData } = useProjectsQuery({ limit: 100 });
  const projects = projectsData?.data || [];

  const { data: currentFolders, isLoading: isLoadingFolders } =
    useNoteFoldersQuery(currentFolderId);

  const navigateToFolder = useCallback((folder: { id: string; name: string }) => {
    setFolderStack((s) => [...s, { id: folder.id, name: folder.name }]);
    setCurrentFolderId(folder.id);
    setPage(1);
  }, []);

  const navigateToCrumb = useCallback((index: number, crumb: Crumb) => {
    setCurrentFolderId(crumb.id);
    setFolderStack((s) => s.slice(0, index + 1));
    setPage(1);
  }, []);

  const navigateToRoot = useCallback(() => {
    setCurrentFolderId(null);
    setFolderStack([]);
    setPage(1);
  }, []);

  const setProjectId = useCallback((id: string) => {
    setProjectIdState(id);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    clearSearch();
    setProjectIdState('');
    setPage(1);
  }, [clearSearch]);

  const hasFilters = !!search || !!projectId;

  const handleCreateNote = useCallback(() => {
    setEditingNote(null);
    setNoteDialogOpen(true);
  }, []);

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
    setNoteDialogOpen(true);
  }, []);

  const handleCreateFolderClick = useCallback((parentId: string | null) => {
    setEditingFolder(null);
    setCreateFolderParentId(parentId);
    setFolderDialogOpen(true);
  }, []);

  const handleEditFolder = useCallback((folder: NoteFolder) => {
    setEditingFolder(folder);
    setFolderDialogOpen(true);
  }, []);

  const handleDeleteNote = useCallback(
    (note: Note) => {
      confirmDelete(
        async () => {
          await deleteNote.mutateAsync(note.id);
          toast.success(t('delete_success') || 'Note deleted successfully');
          if (notes.length === 1 && page > 1) {
            setPage((p) => p - 1);
          }
        },
        {
          title: t('delete_confirm_title'),
          description: t('delete_confirm_desc'),
          confirmText: t('delete_confirm_yes'),
        },
      );
    },
    [confirmDelete, deleteNote, t, notes.length, page],
  );

  const handleDeleteFolder = useCallback(
    (folder: NoteFolder) => {
      confirmDelete(
        async () => {
          await deleteFolder.mutateAsync(folder.id);
          toast.success('Folder deleted successfully');
        },
        {
          title: 'Delete Folder',
          description: `Are you sure you want to delete "${folder.name}"? All notes inside will be deleted.`,
          confirmText: 'Yes, delete folder',
        },
      );
    },
    [confirmDelete, deleteFolder],
  );

  const handleConvertToTask = useCallback(
    (note: Note) => {
      showConfirm({
        title: t('convert_to_task'),
        description: 'Are you sure you want to create a task from this note?',
        confirmText: t('convert_to_task'),
        onConfirm: async () => {
          try {
            const defaultColumn =
              taskColumns?.find(
                (c) =>
                  c.name.toLowerCase().includes('todo') ||
                  c.name.toLowerCase().includes('to do') ||
                  c.name.toLowerCase().includes('to-do'),
              ) || taskColumns?.[0];

            await createTask.mutateAsync({
              title: note.title,
              description: note.content,
              projectId: note.projectId || undefined,
              columnId: defaultColumn?.id || undefined,
              status: 'TODO',
              priority: 'MEDIUM',
            });
            toast.success(t('convert_success') || 'Converted to task successfully');
          } catch {
            toast.error('Failed to convert note to task');
          }
        },
      });
    },
    [showConfirm, t, taskColumns, createTask],
  );

  return {
    currentFolderId,
    folderStack,
    navigateToFolder,
    navigateToCrumb,
    navigateToRoot,
    search,
    debouncedSearch,
    onSearchChange: setSearch,
    projectId,
    setProjectId,
    clearFilters,
    hasFilters,
    page,
    setPage,
    totalPages: meta?.totalPages ?? 1,
    notes,
    meta,
    isLoading,
    currentFolders,
    isLoadingFolders,
    projects,
    noteDialogOpen,
    setNoteDialogOpen,
    editingNote,
    handleCreateNote,
    handleEditNote,
    folderDialogOpen,
    setFolderDialogOpen,
    editingFolder,
    createFolderParentId,
    handleCreateFolderClick,
    handleEditFolder,
    handleDeleteNote,
    handleConvertToTask,
    handleDeleteFolder,
  };
}
