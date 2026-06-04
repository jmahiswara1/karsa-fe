'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import {
  Dialog,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, SignalLow, SignalMedium, SignalHigh, AlertCircle } from 'lucide-react';
import {
  useCreateProject,
  useUpdateProject,
  type Project,
  type CreateProjectInput,
  type ProjectStatus,
  type Priority,
} from '@/hooks/use-projects';
import { cn } from '@/lib/utils';

import { toast } from 'sonner';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'PLANNING', label: 'Planning' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const PRIORITY_OPTIONS: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const t = useTranslations('Projects');
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const isEditing = !!project;
  const isPending = createProject.isPending || updateProject.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    defaultValues: {
      title: '',
      description: '',
      status: 'PLANNING',
      priority: 'MEDIUM',
      deadline: '',
    },
  });

  useEffect(() => {
    if (project && open) {
      reset({
        title: project.title,
        description: project.description || '',
        status: project.status,
        priority: project.priority,
        deadline: project.deadline ? project.deadline.slice(0, 10) : '',
      });
    } else if (!project && open) {
      reset({
        title: '',
        description: '',
        status: 'PLANNING',
        priority: 'MEDIUM',
        deadline: '',
      });
    }
  }, [project, open, reset]);

  const onSubmit = async (data: CreateProjectInput) => {
    const payload: CreateProjectInput = {
      title: data.title,
      ...(data.description && { description: data.description }),
      ...(data.status && { status: data.status }),
      ...(data.priority && { priority: data.priority }),
      ...(data.deadline && { deadline: new Date(data.deadline).toISOString() }),
    };

    try {
      if (isEditing) {
        await updateProject.mutateAsync({ id: project.id, ...payload });
        toast.success(t('edit_success') || 'Project updated successfully');
      } else {
        await createProject.mutateAsync(payload);
        toast.success(t('create_success') || 'Project created successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save project');
    }
  };

  const selectedPriority = watch('priority');
  const selectedStatus = watch('status');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? t('edit_project') : t('create_project')}</DialogTitle>
          <DialogDescription>
            {isEditing ? t('edit_project_desc') : t('create_project_desc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">{t('field_title')}</Label>
            <Input
              id="title"
              placeholder={t('field_title_placeholder')}
              className={cn("text-lg px-4 py-6 font-medium", errors.title ? 'border-red-500' : '')}
              {...register('title', { required: true })}
            />
          </div>

          {/* Metadata row */}
          <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">{t('field_status')}</Label>
              <Select
                value={selectedStatus}
                onValueChange={(val) => setValue('status', (val || 'PLANNING') as ProjectStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('field_status_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {t(`status_${s.value.toLowerCase()}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">{t('field_priority')}</Label>
              <Select
                value={selectedPriority}
                onValueChange={(val) => setValue('priority', (val || 'MEDIUM') as Priority)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('field_priority_placeholder')} />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((p) => (
                    <SelectItem key={p} value={p}>
                      <div className="flex items-center gap-2">
                        {p === 'LOW' && <SignalLow className="h-3.5 w-3.5 text-blue-500" />}
                        {p === 'MEDIUM' && <SignalMedium className="h-3.5 w-3.5 text-yellow-500" />}
                        {p === 'HIGH' && <SignalHigh className="h-3.5 w-3.5 text-orange-500" />}
                        {p === 'URGENT' && <AlertCircle className="h-3.5 w-3.5 text-red-500" />}
                        <span>{t(`priority_${p.toLowerCase()}`)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">{t('field_deadline')}</Label>
              <Input id="deadline" type="date" className="h-9" {...register('deadline')} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">{t('field_description')}</Label>
            <Textarea
              id="description"
              placeholder={t('field_description_placeholder')}
              rows={4}
              className="resize-none"
              {...register('description')}
            />
          </div>

          <DialogFooter className="pt-2 border-t border-border/40">
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
