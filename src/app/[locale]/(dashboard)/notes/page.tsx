'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, FileText, Search, X, ChevronRight, Home } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/empty-state';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteDialog } from '@/components/notes/NoteDialog';
import { DroppableBreadcrumbItem } from '@/components/notes/DroppableBreadcrumbItem';
import { FolderCard } from '@/components/notes/FolderCard';
import { FolderDialog } from '@/components/notes/FolderDialog';
import {
  useNotesQuery,
  useDeleteNote,
  useReorderNotes,
  useUpdateNote,
  type Note,
} from '@/hooks/use-notes';
import { useNoteFoldersQuery, useDeleteNoteFolder, useUpdateNoteFolder, type NoteFolder } from '@/hooks/use-note-folders';
import { useProjectsQuery } from '@/hooks/use-projects';
import { useCreateTask } from '@/hooks/use-tasks';
import { useDialogStore } from '@/store/dialog.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

// DnD Kit imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

export default function NotesPage() {
  const t = useTranslations('Notes');
  const tPages = useTranslations('Pages');
  const { showConfirm } = useDialogStore();
  
  const deleteNote = useDeleteNote();
  const updateNote = useUpdateNote();
  const deleteFolder = useDeleteNoteFolder();
  const createTask = useCreateTask();
  const reorderNotes = useReorderNotes();
  const updateFolder = useUpdateNoteFolder();

  // State
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderStack, setFolderStack] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [projectId, setProjectId] = useState<string | ''>('');

  // Dialogs
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<NoteFolder | null>(null);
  const [createFolderParentId, setCreateFolderParentId] = useState<string | null>(null);

  // Pagination (Simple implementation for now)
  const [page, setPage] = useState(1);
  const limit = 12;

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    const timeout = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  const queryParams = useMemo(
    () => ({
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(projectId && { projectId }),
      folderId: currentFolderId,
      page,
      limit,
    }),
    [debouncedSearch, projectId, page, currentFolderId]
  );

  const { data, isLoading } = useNotesQuery(queryParams);
  const notes = data?.data || [];
  const meta = data?.meta;

  const { data: projectsData } = useProjectsQuery({ limit: 100 });
  const projects = projectsData?.data || [];

  const { data: currentFolders, isLoading: isLoadingFolders } = useNoteFoldersQuery(currentFolderId);

  // Optimistic UI for Drag and Drop
  const [optimisticNotes, setOptimisticNotes] = useState<Note[]>([]);
  useEffect(() => {
    setOptimisticNotes(notes);
  }, [notes]);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts to allow clicks to go through
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const isOverFolder = over.data.current?.type === 'Folder';
    if (isOverFolder && over.data.current?.folderId !== undefined) {
      const targetFolderId = over.data.current.folderId as string | null;

      if (active.data.current?.type === 'Note') {
        const noteId = active.id as string;
        
        // Don't move if it's already in the target folder
        if (targetFolderId === currentFolderId || (targetFolderId === null && currentFolderId === null)) return;
        
        // Update optimistic state
        setOptimisticNotes((items) => items.filter((n) => n.id !== noteId));

        try {
          const realFolderId = targetFolderId === 'folder-root' ? null : (targetFolderId?.replace('folder-', '') || null);
          await updateNote.mutateAsync({ id: noteId, folderId: realFolderId });
          toast.success('Note moved to folder');
        } catch (e) {
          toast.error('Failed to move note');
          setOptimisticNotes(notes); // revert
        }
        return;
      }

      if (active.data.current?.type === 'Folder') {
        const sourceFolderId = (active.id as string).replace('folder-', '');
        
        // Prevent dropping a folder into itself
        if (sourceFolderId === targetFolderId?.replace('folder-', '')) return;
        // Don't move if it's already in the target folder
        if (targetFolderId === currentFolderId || (targetFolderId === null && currentFolderId === null)) return;

        try {
          const realFolderId = targetFolderId === 'folder-root' ? null : (targetFolderId?.replace('folder-', '') || null);
          await updateFolder.mutateAsync({ id: sourceFolderId, data: { parentId: realFolderId } });
          toast.success('Folder moved');
        } catch (e) {
          toast.error('Failed to move folder');
        }
        return;
      }
    }

      // Otherwise, just reordering among notes
      if (active.id !== over.id) {
        setOptimisticNotes((items) => {
          const oldIndex = items.findIndex((i) => i.id === active.id);
          const newIndex = items.findIndex((i) => i.id === over.id);
          
          const newArray = arrayMove(items, oldIndex, newIndex);
          
          // Prepare reorder payload
          const reorderPayload = newArray.map((note, idx) => ({
            id: note.id,
            order: (page - 1) * limit + idx,
          }));
          
          reorderNotes.mutate(reorderPayload);
          
          return newArray;
        });
      }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setNoteDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteDialogOpen(true);
  };

  const handleDeleteNote = (note: Note) => {
    showConfirm({
      title: t('delete_confirm_title'),
      description: t('delete_confirm_desc'),
      confirmText: t('delete_confirm_yes'),
      onConfirm: async () => {
        try {
          await deleteNote.mutateAsync(note.id);
          toast.success(t('delete_success') || 'Note deleted successfully');
          if (notes.length === 1 && page > 1) {
            setPage(page - 1);
          }
        } catch (error) {
          toast.error('Failed to delete note');
        }
      },
    });
  };

  const handleCreateFolderClick = (parentId: string | null) => {
    setEditingFolder(null);
    setCreateFolderParentId(parentId);
    setFolderDialogOpen(true);
  };

  const handleEditFolder = (folder: NoteFolder) => {
    setEditingFolder(folder);
    setFolderDialogOpen(true);
  };

  const handleDeleteFolder = (folder: NoteFolder) => {
    showConfirm({
      title: 'Delete Folder',
      description: `Are you sure you want to delete "${folder.name}"? All notes inside will be deleted.`,
      confirmText: 'Yes, delete folder',
      onConfirm: async () => {
        try {
          await deleteFolder.mutateAsync(folder.id);
          toast.success('Folder deleted successfully');
        } catch (error) {
          toast.error('Failed to delete folder');
        }
      },
    });
  };

  const handleConvertToTask = (note: Note) => {
    showConfirm({
      title: t('convert_to_task'),
      description: 'Are you sure you want to create a task from this note?',
      confirmText: t('convert_to_task'),
      onConfirm: async () => {
        try {
          await createTask.mutateAsync({
            title: note.title,
            description: note.content,
            projectId: note.projectId || undefined,
            status: 'TODO',
            priority: 'MEDIUM',
          });
          toast.success(t('convert_success') || 'Converted to task successfully');
        } catch (error) {
          toast.error('Failed to convert note to task');
        }
      },
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setProjectId('');
    setPage(1);
  };

  const hasFilters = !!search || !!projectId;

  return (
    <div className="flex flex-col space-y-6 pb-2 w-full">
      {/* Header */}
      <PageHeader
            title={tPages('notes_title')}
            description={tPages('notes_desc')}
            actions={
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleCreateFolderClick(currentFolderId)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Folder
                </Button>
                <Button onClick={handleCreateNote} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('create_note')}
                </Button>
              </div>
            }
          />

          {/* Breadcrumbs */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground pb-2 border-b border-border/40">
            <DroppableBreadcrumbItem
              folderId={null}
              label="Notes"
              isCurrent={currentFolderId === null}
              onClick={() => {
                setCurrentFolderId(null);
                setFolderStack([]);
                setPage(1);
              }}
            />
            
            {folderStack.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 opacity-50" />
                <DroppableBreadcrumbItem
                  folderId={crumb.id}
                  label={crumb.name}
                  isCurrent={index === folderStack.length - 1}
                  onClick={() => {
                    setCurrentFolderId(crumb.id);
                    setFolderStack(folderStack.slice(0, index + 1));
                    setPage(1);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder={t('search_placeholder')}
                className="pl-9 h-9"
              />
            </div>

            {/* Project Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline' }), 'h-9 gap-2 font-medium text-sm max-w-[200px]')}>
                <span className="truncate">
                  {projectId ? projects.find(p => p.id === projectId)?.title || t('filter_project') : t('filter_project')}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px] max-h-[300px] overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => { setProjectId(''); setPage(1); }}
                  className={cn(!projectId && 'bg-accent font-semibold')}
                >
                  {t('filter_project')}
                </DropdownMenuItem>
                {projects.map(p => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => { setProjectId(p.id); setPage(1); }}
                    className={cn(projectId === p.id && 'bg-accent font-semibold')}
                  >
                    {p.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters */}
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1.5 text-muted-foreground">
                <X className="h-3.5 w-3.5" />
                {t('clear_filters')}
              </Button>
            )}
          </div>

          {/* Grid View */}
          <div>
            {/* Render Folders First */}
            {(!isLoadingFolders && currentFolders && currentFolders.length > 0 && !hasFilters) && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Folders</h4>
                <SortableContext items={currentFolders.map(f => `folder-${f.id}`)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentFolders.map((folder) => (
                    <FolderCard
                      key={folder.id}
                      folder={folder}
                      onClick={() => {
                        setFolderStack([...folderStack, { id: folder.id, name: folder.name }]);
                        setCurrentFolderId(folder.id);
                        setPage(1);
                      }}
                      onEdit={() => handleEditFolder(folder)}
                      onDelete={() => handleDeleteFolder(folder)}
                    />
                  ))}
                  </div>
                </SortableContext>
              </div>
            )}

            {/* Render Notes */}
            <div>
              {(!hasFilters && currentFolders && currentFolders.length > 0) && (
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">Files</h4>
              )}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex flex-col h-[200px] rounded-xl border border-border/50 p-5 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="flex-1 space-y-2 mt-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                      <div className="flex justify-between mt-auto">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : optimisticNotes.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title={hasFilters ? t('no_results') : (currentFolders?.length ? 'No files in this folder' : t('no_notes'))}
                  description={hasFilters ? t('no_results_desc') : t('no_notes_desc')}
                  actionLabel={!hasFilters ? t('create_note') : undefined}
                  onAction={!hasFilters ? handleCreateNote : undefined}
                />
              ) : (
                <SortableContext items={optimisticNotes.map(n => n.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {optimisticNotes.map((note, index) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        index={index}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                        onConvertToTask={handleConvertToTask}
                        onClick={handleEditNote}
                      />
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
            </div>
          </DndContext>
          
          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-6">
              <span className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

      {/* Create/Edit Dialogs */}
      <NoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        note={editingNote}
        defaultProjectId={projectId || undefined}
        defaultFolderId={currentFolderId || undefined}
      />
      <FolderDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        folder={editingFolder}
        parentId={createFolderParentId}
      />
    </div>
  );
}
