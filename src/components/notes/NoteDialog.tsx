'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useCreateNote, useUpdateNote, type Note, type CreateNoteInput } from '@/hooks/use-notes';
import { useProjectsQuery } from '@/hooks/use-projects';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: Note | null;
  defaultProjectId?: string;
  defaultFolderId?: string;
}

export function NoteDialog({
  open,
  onOpenChange,
  note,
  defaultProjectId,
  defaultFolderId,
}: NoteDialogProps) {
  const t = useTranslations('Notes');
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();

  // Fetch projects for the dropdown
  const { data: projectsData } = useProjectsQuery({ limit: 100 });
  const projects = projectsData?.data || [];

  const isEditing = !!note;
  const isPending = createNote.isPending || updateNote.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateNoteInput>({
    defaultValues: {
      title: '',
      content: '',
      projectId: defaultProjectId || '',
      folderId: defaultFolderId || '',
    },
  });

  useEffect(() => {
    if (note && open) {
      reset({
        title: note.title,
        content: note.content,
        projectId: note.projectId || '',
        folderId: note.folderId || '',
      });
    } else if (!note && open) {
      reset({
        title: '',
        content: '',
        projectId: defaultProjectId || '',
        folderId: defaultFolderId || '',
      });
    }
  }, [note, open, reset, defaultProjectId, defaultFolderId]);

  const onSubmit = async (data: CreateNoteInput) => {
    const payload: CreateNoteInput = {
      title: data.title,
      content: data.content,
      ...(data.projectId && data.projectId !== 'none' && { projectId: data.projectId }),
      ...(data.folderId && { folderId: data.folderId }),
    };

    // If user selects 'none', we need to explicitly send null/empty string,
    // but DTO might reject it. Usually undefined omits it, or empty string clears it.
    // Let's rely on undefined for creation, and null for update if supported.
    if (data.projectId === 'none') {
      delete payload.projectId;
      // For update, to remove a project, we might need to send projectId: null
      // This depends on the backend, let's assume empty string or undefined clears it.
      if (isEditing) {
        // @ts-expect-error - bypassing DTO strictly typed as string
        payload.projectId = null;
      }
    }

    try {
      if (isEditing) {
        await updateNote.mutateAsync({ id: note.id, ...payload });
        toast.success(t('edit_success') || 'Note updated successfully');
      } else {
        await createNote.mutateAsync(payload);
        toast.success(t('create_success') || 'Note created successfully');
      }
      onOpenChange(false);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save note');
    }
  };

  const selectedProject = watch('projectId');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('edit_note') : t('create_note')}</DialogTitle>
          <DialogDescription>
            {isEditing ? t('edit_note_desc') : t('create_note_desc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex min-h-0 flex-1 flex-col gap-4">
          <DialogBody className="mt-2 flex flex-col gap-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                {t('field_title')}
              </Label>
              <Input
                id="title"
                placeholder={t('field_title_placeholder')}
                className={cn(
                  'px-4 py-5 text-lg font-medium',
                  errors.title ? 'border-red-500' : '',
                )}
                {...register('title', { required: true })}
              />
            </div>

            {/* Project Selection */}
            <div className="bg-muted/20 border-border/50 space-y-2 rounded-xl border p-4">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                {t('field_project')}
              </Label>
              <Select
                value={selectedProject || 'none'}
                onValueChange={(val) =>
                  setValue('projectId', val === 'none' ? '' : (val as string))
                }
              >
                <SelectTrigger>
                  {selectedProject && selectedProject !== 'none' ? (
                    <span className="truncate">
                      {projects.find((p) => p.id === selectedProject)?.title || selectedProject}
                    </span>
                  ) : (
                    <span className="text-muted-foreground truncate">
                      {t('field_project_placeholder')}
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-muted-foreground italic">
                    {t('field_no_project')}
                  </SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <Label htmlFor="content" className="text-sm font-semibold">
                {t('field_content')}
              </Label>
              <Textarea
                id="content"
                placeholder={t('field_content_placeholder')}
                rows={8}
                className={cn(
                  'resize-none p-4 leading-relaxed',
                  errors.content ? 'border-red-500' : '',
                )}
                {...register('content', { required: true })}
              />
            </div>
          </DialogBody>

          <DialogFooter className="border-border/40 border-t pt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? t('save') : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
