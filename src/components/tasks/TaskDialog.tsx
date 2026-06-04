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
  Trash2
} from 'lucide-react';
import {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useProjectsList,
  useTaskColumns,
  type Task,
  type CreateTaskInput,
  type TaskStatus,
  type Priority,
} from '@/hooks/use-tasks';
import { cn } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

  const handleAutoSave = (field: keyof CreateTaskInput, value: any) => {
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
      description: 'This action cannot be undone. This will permanently delete the task and remove its data from our servers.',
      confirmText: 'Yes, delete task',
      onConfirm: async () => {
        await deleteTask.mutateAsync(task.id);
        onOpenChange(false);
      }
    });
  };

  const selectedPriority = watch('priority');

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
      <DialogContent className={isEditing ? "sm:max-w-4xl gap-0 p-0 overflow-hidden" : "sm:max-w-lg"}>
        
        {isEditing && task ? (
          /* EDIT MODE: Premium Two-Column Layout */
          <div className="flex h-[80vh] max-h-[800px] bg-background">
            
            {/* Left Column: Main Content (70%) */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              
              {/* Header Breadcrumb & Status */}
              <div className="flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="hover:text-foreground cursor-pointer transition-colors">Karsa</span>
                  <span>/</span>
                  <span className="hover:text-foreground cursor-pointer transition-colors">Task-{task.id.slice(-5).toUpperCase()}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 opacity-70">
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
                  
                  <div className="h-4 w-px bg-border/50 mx-1"></div>
                  
                  <button 
                    onClick={handleDeleteTask}
                    disabled={deleteTask.isPending}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-500/80 hover:text-red-500 transition-colors"
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
                    className="w-full text-3xl font-extrabold border-2 border-transparent hover:border-border/60 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent px-3 py-2 -ml-3 rounded-lg outline-none transition-all placeholder:text-muted-foreground/30 resize-none overflow-hidden leading-tight"
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
                <div className="space-y-2 mt-4">
                  <textarea 
                    className="w-full min-h-[300px] text-base border-2 border-transparent hover:border-border/60 focus:border-primary focus:ring-4 focus:ring-primary/10 bg-transparent px-4 py-3 -ml-4 rounded-xl outline-none resize-y transition-all placeholder:text-muted-foreground/50 leading-relaxed text-foreground/90"
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
            <div className="w-[300px] shrink-0 border-l border-border/40 bg-muted/10 p-6 flex flex-col gap-8 overflow-y-auto">
              
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Properties</h4>
                
                <div className="flex flex-col gap-1">
                  
                  {/* Board / Status */}
                  <div className="flex items-center justify-between group py-1.5 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
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
                            handleAutoSave('columnId', value);
                          }}
                        >
                          <SelectTrigger className="h-7 bg-muted/30 border-transparent hover:bg-muted/60 transition-colors text-xs font-semibold shadow-none focus:ring-0 px-2 w-full [&>span]:truncate rounded-md">
                            <SelectValue placeholder="Select board" />
                          </SelectTrigger>
                          <SelectContent align="end" className="w-[180px] p-1">
                            {columns.map(c => (
                              <SelectItem key={c.id} value={c.id} className="text-xs font-medium cursor-pointer py-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-sm bg-primary/40" />
                                  <span className="truncate">{c.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="w-[140px] h-7 bg-muted/30 animate-pulse rounded-md"></div>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="flex items-center justify-between group py-1.5 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
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
                        <SelectTrigger className="h-7 bg-muted/30 border-transparent hover:bg-muted/60 transition-colors text-xs font-semibold shadow-none focus:ring-0 px-2 w-full [&>span]:truncate rounded-md">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent align="end" className="p-1">
                          <SelectItem value="LOW" className="text-xs font-medium cursor-pointer py-1.5">
                            <div className="flex items-center gap-2 text-blue-500">
                              <SignalLow className="h-3.5 w-3.5" />
                              <span className="text-foreground">Low</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="MEDIUM" className="text-xs font-medium cursor-pointer py-1.5">
                            <div className="flex items-center gap-2 text-yellow-500">
                              <SignalMedium className="h-3.5 w-3.5" />
                              <span className="text-foreground">Medium</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="HIGH" className="text-xs font-medium cursor-pointer py-1.5">
                            <div className="flex items-center gap-2 text-orange-500">
                              <SignalHigh className="h-3.5 w-3.5" />
                              <span className="text-foreground">High</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="URGENT" className="text-xs font-medium cursor-pointer py-1.5">
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
                  <div className="flex items-center justify-between group py-1.5 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                      <Folder className="h-3.5 w-3.5" />
                      <span>Project</span>
                    </div>
                    {projects ? (
                      <div className="w-[140px]">
                        <Select 
                          value={editProjectId || "unassigned"}
                          onValueChange={(val) => {
                            const value = val === "unassigned" || !val ? "" : val;
                            setEditProjectId(value);
                            handleAutoSave('projectId', value);
                          }}
                        >
                          <SelectTrigger className="h-7 bg-muted/30 border-transparent hover:bg-muted/60 transition-colors text-xs font-semibold shadow-none focus:ring-0 px-2 w-full [&>span]:truncate rounded-md">
                            <SelectValue placeholder="None" />
                          </SelectTrigger>
                          <SelectContent align="end" className="w-[180px] p-1">
                            <SelectItem value="unassigned" className="text-xs font-medium cursor-pointer py-1.5 text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <div className="w-3.5 h-3.5 rounded-full border border-dashed border-muted-foreground/50" />
                                <span>No Project</span>
                              </div>
                            </SelectItem>
                            {projects.map(p => (
                              <SelectItem key={p.id} value={p.id} className="text-xs font-medium cursor-pointer py-1.5">
                                <div className="flex items-center gap-2">
                                  <Folder className="h-3.5 w-3.5 text-primary/70" />
                                  <span className="truncate">{p.title}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="w-[140px] h-7 bg-muted/30 animate-pulse rounded-md"></div>
                    )}
                  </div>

                  {/* Deadline */}
                  <div className="flex items-center justify-between group py-1.5 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Deadline</span>
                    </div>
                    <div className="w-[140px]">
                      <input 
                        type="date"
                        className="h-7 w-full bg-muted/30 border border-transparent rounded-md px-2.5 text-xs font-semibold text-foreground cursor-pointer hover:bg-muted/60 transition-colors outline-none focus:border-border"
                        defaultValue={task.deadline ? task.deadline.slice(0, 10) : ''}
                        onBlur={(e) => handleAutoSave('deadline', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Estimate */}
                  <div className="flex items-center justify-between group py-1.5 border-b border-border/20 last:border-0">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Estimate</span>
                    </div>
                    <div className="w-[140px] flex items-center gap-1.5">
                      <input 
                        type="number"
                        min={0}
                        placeholder="--"
                        className="h-7 w-14 bg-muted/30 border border-transparent rounded-md px-2 text-xs font-semibold text-center text-foreground placeholder:text-muted-foreground/50 hover:bg-muted/60 transition-colors outline-none focus:border-border"
                        defaultValue={task.estimate || ''}
                        onBlur={(e) => handleAutoSave('estimate', Number(e.target.value))}
                      />
                      <span className="text-xs text-muted-foreground/70 font-medium">pts</span>
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

            <form onSubmit={handleSubmit(onSubmitCreate)} className="flex flex-col gap-5 mt-2">
              {/* Title */}
              <div className="space-y-2">
                <Input
                  id="title"
                  placeholder="Task Title..."
                  className={cn("text-lg px-4 py-6 font-medium", errors.title ? 'border-red-500' : '')}
                  {...register('title', { required: true })}
                />
              </div>

              {/* Metadata row */}
              <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Board Column</Label>
                  <Select
                    value={watch('columnId') || undefined}
                    onValueChange={(val) => setValue('columnId', val || '')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select column" />
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
                  <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">{t('field_priority')}</Label>
                  <Select
                    value={selectedPriority}
                    onValueChange={(val) => setValue('priority', (val || 'MEDIUM') as Priority)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
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
                  <Label className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">{t('field_project')}</Label>
                  <Select
                    value={watch('projectId') || 'unassigned'}
                    onValueChange={(val) => setValue('projectId', val === 'unassigned' || !val ? '' : val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No Project" />
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
