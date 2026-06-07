'use client';

import { useEffect, useState } from 'react';
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
import { useDialogStore } from '@/store/dialog.store';
import {
  Loader2,
  CheckCircle2,
  Clock,
  LayoutTemplate,
  Flag,
  Folder,
  Calendar,
  SignalLow,
  SignalMedium,
  SignalHigh,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useProjectsList,
  useTaskColumns,
  type Task,
  type CreateTaskInput,
  type Priority,
} from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';

import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultColumnId?: string;
}

const PRIORITY_OPTIONS: Priority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export function TaskDialog({ open, onOpenChange, task, defaultColumnId }: TaskDialogProps) {
  const t = useTranslations('Tasks');
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { data: projects } = useProjectsList();
  const { data: columns } = useTaskColumns();

  const { showConfirm } = useDialogStore();

  const isEditing = !!task;
  const isPending = createTask.isPending;
  const isSaving = updateTask.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      projectId: '',
      columnId: '',
      deadline: '',
      estimate: undefined,
    },
  });

  useEffect(() => {
    if (!isEditing) {
      reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: '',
        columnId: defaultColumnId || '',
        deadline: '',
        estimate: undefined,
      });
    }
  }, [task, defaultColumnId, reset, open, isEditing]);

  const onSubmitCreate = async (data: CreateTaskInput) => {
    const payload: CreateTaskInput = {
      title: data.title,
      ...(data.description && { description: data.description }),
      ...(data.priority && { priority: data.priority }),
      ...(data.projectId && { projectId: data.projectId }),
      ...(data.columnId && { columnId: data.columnId }),
      ...(data.deadline && { deadline: new Date(data.deadline).toISOString() }),
      ...(data.estimate && { estimate: Number(data.estimate) }),
    };

    try {
      await createTask.mutateAsync(payload);
      onOpenChange(false);
    } catch {
      // error handled by mutation
    }
  };

  const handleAutoSave = (
    field: keyof CreateTaskInput,
    value: string | number | undefined | null,
  ) => {
    if (!task) return;

    // Format value if needed
    if (field === 'deadline' && value) {
      value = new Date(value).toISOString();
    }

    updateTask.mutate({ id: task.id, [field]: value });
  };

  const handleDeleteTask = () => {
    if (!task) return;
    showConfirm({
      title: 'Are you absolutely sure?',
      description:
        'This action cannot be undone. This will permanently delete the task and remove its data from our servers.',
      confirmText: 'Yes, delete task',
      onConfirm: async () => {
        await deleteTask.mutateAsync(task.id);
        onOpenChange(false);
      },
    });
  };

  const selectedPriority = watch('priority');
  const selectedColumnId = watch('columnId');
  const selectedProjectId = watch('projectId');

  // Local state for Edit Mode to ensure Selects are fully controlled and map values correctly
  const [editColumnId, setEditColumnId] = useState(task?.columnId || '');
  const [editPriority, setEditPriority] = useState(task?.priority || 'MEDIUM');
  const [editProjectId, setEditProjectId] = useState(task?.projectId || '');

  useEffect(() => {
    if (task) {
      setEditColumnId(task.columnId || '');
      setEditPriority(task.priority || 'MEDIUM');
      setEditProjectId(task.projectId || '');
    }
  }, [task]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={isEditing ? 'gap-0 overflow-hidden p-0 sm:max-w-4xl' : 'sm:max-w-lg'}
      >
        {isEditing && task ? (
          /* EDIT MODE: Premium Two-Column Layout */
          <div className="bg-background flex h-[80vh] max-h-[800px]">
            {/* Left Column: Main Content (70%) */}
            <div className="flex flex-1 flex-col overflow-y-auto">
              {/* Header Breadcrumb & Status */}
              <div className="flex items-center justify-between px-8 py-5">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <span className="hover:text-foreground cursor-pointer transition-colors">
                    Karsa
                  </span>
                  <span>/</span>
                  <span className="hover:text-foreground cursor-pointer transition-colors">
                    Task-{task.id.slice(-5).toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium opacity-70">
                    {isSaving ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Saved
                      </>
                    )}
                  </span>

                  <div className="bg-border/50 mx-1 h-4 w-px"></div>

                  <button
                    onClick={handleDeleteTask}
                    disabled={deleteTask.isPending}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-500/80 transition-colors hover:text-red-500"
                  >
                    {deleteTask.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>

              {/* Main Editing Area */}
              <div className="flex flex-col gap-6 px-8 pb-10">
                {/* Title */}
                <div>
                  <textarea
                    className="hover:border-border/60 focus:border-primary focus:ring-primary/10 placeholder:text-muted-foreground/30 -ml-3 w-full resize-none overflow-hidden rounded-lg border-2 border-transparent bg-transparent px-3 py-2 text-3xl leading-tight font-extrabold transition-all outline-none focus:ring-4"
                    defaultValue={task.title}
                    placeholder="Task Title"
                    rows={2}
                    onBlur={(e) => {
                      handleAutoSave('title', e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.blur();
                      }
                    }}
                  />
                </div>

                {/* Description */}
                <div className="mt-4 space-y-2">
                  <textarea
                    className="hover:border-border/60 focus:border-primary focus:ring-primary/10 placeholder:text-muted-foreground/50 text-foreground/90 -ml-4 min-h-[300px] w-full resize-y rounded-xl border-2 border-transparent bg-transparent px-4 py-3 text-base leading-relaxed transition-all outline-none focus:ring-4"
                    defaultValue={task.description || ''}
                    placeholder="Add a more detailed description..."
                    onBlur={(e) => {
                      handleAutoSave('description', e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Sidebar Properties (30%) */}
            <div className="border-border/40 bg-muted/10 flex w-[300px] shrink-0 flex-col gap-8 overflow-y-auto border-l p-6">
              <div>
                <h4 className="text-muted-foreground mb-4 text-xs font-bold tracking-widest uppercase">
                  Properties
                </h4>

                <div className="flex flex-col gap-1">
                  {/* Board / Status */}
                  <div className="group border-border/20 flex items-center justify-between border-b py-1.5 last:border-0">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                      <LayoutTemplate className="h-3.5 w-3.5" />
                      <span>Board</span>
                    </div>
                    {columns ? (
                      <div className="w-[140px]">
                        <Select
                          value={editColumnId || undefined}
                          onValueChange={(val) => {
                            const value = val || '';
                            setEditColumnId(value);

                            // Determine new status based on column name
                            let newStatus = task.status;
                            const destColumn = columns?.find((c) => c.id === value);
                            if (destColumn) {
                              const colName = destColumn.name.toLowerCase();
                              if (
                                colName.includes('todo') ||
                                colName.includes('to do') ||
                                colName.includes('to-do')
                              ) {
                                newStatus = 'TODO';
                              } else if (
                                colName.includes('progress') ||
                                colName.includes('doing') ||
                                colName.includes('active')
                              ) {
                                newStatus = 'IN_PROGRESS';
                              } else if (
                                colName.includes('done') ||
                                colName.includes('complete') ||
                                colName.includes('finish')
                              ) {
                                newStatus = 'DONE';
                              }
                            }

                            updateTask.mutate({ id: task.id, columnId: value, status: newStatus });
                          }}
                        >
                          <SelectTrigger className="bg-muted/30 hover:bg-muted/60 h-7 w-full rounded-md border-transparent px-2 text-xs font-semibold shadow-none transition-colors focus:ring-0 [&>span]:truncate">
                            {editColumnId && columns ? (
                              <span className="truncate">
                                {columns.find((c) => c.id === editColumnId)?.name || 'Select board'}
                              </span>
                            ) : (
                              <span className="text-muted-foreground truncate">Select board</span>
                            )}
                          </SelectTrigger>
                          <SelectContent align="end" className="w-[180px] p-1">
                            {columns.map((c) => (
                              <SelectItem
                                key={c.id}
                                value={c.id}
                                className="cursor-pointer py-1.5 text-xs font-medium"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="bg-primary/40 h-2 w-2 rounded-sm" />
                                  <span className="truncate">{c.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="bg-muted/30 h-7 w-[140px] animate-pulse rounded-md"></div>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="group border-border/20 flex items-center justify-between border-b py-1.5 last:border-0">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                      <Flag className="h-3.5 w-3.5" />
                      <span>Priority</span>
                    </div>
                    <div className="w-[140px]">
                      <Select
                        value={editPriority}
                        onValueChange={(val) => {
                          const value = (val || 'MEDIUM') as Priority;
                          setEditPriority(value);
                          handleAutoSave('priority', value);
                        }}
                      >
                        <SelectTrigger className="bg-muted/30 hover:bg-muted/60 h-7 w-full rounded-md border-transparent px-2 text-xs font-semibold shadow-none transition-colors focus:ring-0 [&>span]:truncate">
                          {editPriority ? (
                            <div className="flex items-center gap-2">
                              {editPriority === 'LOW' && (
                                <SignalLow className="h-3.5 w-3.5 text-blue-500" />
                              )}
                              {editPriority === 'MEDIUM' && (
                                <SignalMedium className="h-3.5 w-3.5 text-yellow-500" />
                              )}
                              {editPriority === 'HIGH' && (
                                <SignalHigh className="h-3.5 w-3.5 text-orange-500" />
                              )}
                              {editPriority === 'URGENT' && (
                                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                              )}
                              <span className="truncate capitalize">
                                {editPriority.toLowerCase()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground truncate">Select priority</span>
                          )}
                        </SelectTrigger>
                        <SelectContent align="end" className="p-1">
                          <SelectItem
                            value="LOW"
                            className="cursor-pointer py-1.5 text-xs font-medium"
                          >
                            <div className="flex items-center gap-2 text-blue-500">
                              <SignalLow className="h-3.5 w-3.5" />
                              <span className="text-foreground">Low</span>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="MEDIUM"
                            className="cursor-pointer py-1.5 text-xs font-medium"
                          >
                            <div className="flex items-center gap-2 text-yellow-500">
                              <SignalMedium className="h-3.5 w-3.5" />
                              <span className="text-foreground">Medium</span>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="HIGH"
                            className="cursor-pointer py-1.5 text-xs font-medium"
                          >
                            <div className="flex items-center gap-2 text-orange-500">
                              <SignalHigh className="h-3.5 w-3.5" />
                              <span className="text-foreground">High</span>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="URGENT"
                            className="cursor-pointer py-1.5 text-xs font-medium"
                          >
                            <div className="flex items-center gap-2 text-red-500">
                              <AlertCircle className="h-3.5 w-3.5" />
                              <span className="text-foreground">Urgent</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Project */}
                  <div className="group border-border/20 flex items-center justify-between border-b py-1.5 last:border-0">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                      <Folder className="h-3.5 w-3.5" />
                      <span>Project</span>
                    </div>
                    {projects ? (
                      <div className="w-[140px]">
                        <Select
                          value={editProjectId || 'unassigned'}
                          onValueChange={(val) => {
                            const value = val === 'unassigned' || !val ? '' : val;
                            setEditProjectId(value);
                            handleAutoSave('projectId', value);
                          }}
                        >
                          <SelectTrigger className="bg-muted/30 hover:bg-muted/60 h-7 w-full rounded-md border-transparent px-2 text-xs font-semibold shadow-none transition-colors focus:ring-0 [&>span]:truncate">
                            {editProjectId && editProjectId !== 'unassigned' && projects ? (
                              <div className="flex items-center gap-2">
                                <Folder className="text-primary/70 h-3.5 w-3.5" />
                                <span className="truncate">
                                  {projects.find((p) => p.id === editProjectId)?.title || 'Unknown'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground truncate">No Project</span>
                            )}
                          </SelectTrigger>
                          <SelectContent align="end" className="w-[180px] p-1">
                            <SelectItem
                              value="unassigned"
                              className="text-muted-foreground cursor-pointer py-1.5 text-xs font-medium"
                            >
                              <div className="flex items-center gap-2">
                                <div className="border-muted-foreground/50 h-3.5 w-3.5 rounded-full border border-dashed" />
                                <span>No Project</span>
                              </div>
                            </SelectItem>
                            {projects.map((p) => (
                              <SelectItem
                                key={p.id}
                                value={p.id}
                                className="cursor-pointer py-1.5 text-xs font-medium"
                              >
                                <div className="flex items-center gap-2">
                                  <Folder className="text-primary/70 h-3.5 w-3.5" />
                                  <span className="truncate">{p.title}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="bg-muted/30 h-7 w-[140px] animate-pulse rounded-md"></div>
                    )}
                  </div>

                  {/* Deadline */}
                  <div className="group border-border/20 flex items-center justify-between border-b py-1.5 last:border-0">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Deadline</span>
                    </div>
                    <div className="w-[140px]">
                      <input
                        type="date"
                        className="bg-muted/30 text-foreground hover:bg-muted/60 focus:border-border h-7 w-full cursor-pointer rounded-md border border-transparent px-2.5 text-xs font-semibold transition-colors outline-none"
                        defaultValue={task.deadline ? task.deadline.slice(0, 10) : ''}
                        onBlur={(e) => handleAutoSave('deadline', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Estimate */}
                  <div className="group border-border/20 flex items-center justify-between border-b py-1.5 last:border-0">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Estimate</span>
                    </div>
                    <div className="flex w-[140px] items-center gap-1.5">
                      <input
                        type="number"
                        min={0}
                        placeholder="--"
                        className="bg-muted/30 text-foreground placeholder:text-muted-foreground/50 hover:bg-muted/60 focus:border-border h-7 w-14 rounded-md border border-transparent px-2 text-center text-xs font-semibold transition-colors outline-none"
                        defaultValue={task.estimate || ''}
                        onBlur={(e) => handleAutoSave('estimate', Number(e.target.value))}
                      />
                      <span className="text-muted-foreground/70 text-xs font-medium">pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CREATE MODE: Standard Form */
          <>
            <DialogHeader>
              <DialogTitle>{t('create_task')}</DialogTitle>
              <DialogDescription>{t('create_task_desc')}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmitCreate)} className="mt-2 flex flex-col gap-5">
              {/* Title */}
              <div className="space-y-2">
                <Input
                  id="title"
                  placeholder="Task Title..."
                  className={cn(
                    'px-4 py-6 text-lg font-medium',
                    errors.title ? 'border-red-500' : '',
                  )}
                  {...register('title', { required: true })}
                />
              </div>

              {/* Metadata row */}
              <div className="bg-muted/20 border-border/50 grid grid-cols-2 gap-4 rounded-xl border p-4">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Board Column
                  </Label>
                  <Select
                    value={selectedColumnId || undefined}
                    onValueChange={(val) => setValue('columnId', val || '')}
                  >
                    <SelectTrigger>
                      {selectedColumnId && columns ? (
                        <span className="truncate">
                          {columns.find((c) => c.id === selectedColumnId)?.name || 'Select column'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground truncate">Select column</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {columns?.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {t('field_priority')}
                  </Label>
                  <Select
                    value={selectedPriority}
                    onValueChange={(val) => setValue('priority', (val || 'MEDIUM') as Priority)}
                  >
                    <SelectTrigger>
                      {selectedPriority ? (
                        <span className="truncate capitalize">
                          {t(`priority_${selectedPriority.toLowerCase()}`)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground truncate">Select priority</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {t(`priority_${p.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {t('field_project')}
                  </Label>
                  <Select
                    value={selectedProjectId || 'unassigned'}
                    onValueChange={(val) =>
                      setValue('projectId', val === 'unassigned' || !val ? '' : val)
                    }
                  >
                    <SelectTrigger>
                      {selectedProjectId && selectedProjectId !== 'unassigned' && projects ? (
                        <span className="truncate">
                          {projects.find((p) => p.id === selectedProjectId)?.title || 'Unknown'}
                        </span>
                      ) : (
                        <span className="text-muted-foreground truncate">No Project</span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">{t('no_project')}</SelectItem>
                      {projects?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {t('field_deadline')}
                  </Label>
                  <Input id="deadline" type="date" className="h-9" {...register('deadline')} />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  {t('field_description')}
                </Label>
                <Textarea
                  id="description"
                  placeholder={t('field_description_placeholder')}
                  rows={4}
                  className="resize-none"
                  {...register('description')}
                />
              </div>

              <DialogFooter className="border-border/40 border-t pt-2">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  {t('cancel')}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('create')}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
