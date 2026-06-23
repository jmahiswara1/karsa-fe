'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Clock, Sparkles, Pencil, Trash2, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlannerEntry, PlannerCategory } from '@/hooks/use-planner';

const CATEGORIES: { key: PlannerCategory; color: string; bg: string }[] = [
  {
    key: 'FOCUS',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-900/20 ring-sky-200 dark:ring-sky-800/30',
  },
  {
    key: 'BREAK',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 ring-emerald-200 dark:ring-emerald-800/30',
  },
  {
    key: 'MEETING',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20 ring-amber-200 dark:ring-amber-800/30',
  },
  {
    key: 'PERSONAL',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20 ring-violet-200 dark:ring-violet-800/30',
  },
  {
    key: 'OTHER',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-900/20 ring-slate-200 dark:ring-slate-800/30',
  },
];

const schema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
    category: z.string(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
  });

type FormData = z.infer<typeof schema>;

interface PlannerEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: PlannerEntry | null;
  defaultHour: number;
  defaultDate?: string;
  onSubmit: (data: FormData & { category: PlannerCategory }) => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

type DialogMode = 'view' | 'edit';

function calcDuration(start: string, end: string): string {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const dur = eh * 60 + em - (sh * 60 + sm);
  const h = Math.floor(dur / 60);
  const m = dur % 60;
  if (dur <= 0) return '';
  return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
}

export function PlannerEntryDialog({
  open,
  onOpenChange,
  entry,
  defaultHour,
  defaultDate,
  onSubmit,
  onDelete,
  isSubmitting,
}: PlannerEntryDialogProps) {
  const t = useTranslations('Focus');
  const [mode, setMode] = useState<DialogMode>('edit');

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      startTime: `${String(defaultHour).padStart(2, '0')}:00`,
      endTime: `${String(defaultHour + 1).padStart(2, '0')}:00`,
      category: 'FOCUS',
    },
  });

  const { reset, register, setValue, watch } = form;

  useEffect(() => {
    if (open) {
      if (entry) {
        setMode('view');
        reset({
          title: entry.title,
          description: entry.description || '',
          startTime: entry.startTime,
          endTime: entry.endTime,
          category: entry.category ?? 'FOCUS',
        });
      } else {
        setMode('edit');
        reset({
          title: '',
          description: '',
          startTime: `${String(defaultHour).padStart(2, '0')}:00`,
          endTime: `${String(defaultHour + 1).padStart(2, '0')}:00`,
          category: 'FOCUS',
        });
      }
    }
  }, [open, entry, defaultHour, reset]);

  const switchToEdit = () => setMode('edit');

  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');
  const watchCategory = watch('category');
  const duration = calcDuration(watchStartTime, watchEndTime);

  const handleSubmit = (data: FormData) => {
    onSubmit({ ...data, category: (data.category as PlannerCategory) ?? 'FOCUS' });
  };

  // ── View Mode ──

  if (mode === 'view' && entry) {
    const cat = CATEGORIES.find((c) => c.key === (entry.category ?? 'FOCUS')) ?? CATEGORIES[0];

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{entry.title}</DialogTitle>
            <DialogDescription>
              {entry.date &&
                new Date(entry.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Time + Duration */}
            <div className="bg-muted/30 flex items-center gap-3 rounded-xl p-3">
              <Clock className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">
                  {entry.startTime} - {entry.endTime}
                </p>
                <p className="text-muted-foreground text-xs">
                  {calcDuration(entry.startTime, entry.endTime)}
                </p>
              </div>
            </div>

            {/* Category + Sync badge */}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-medium ring-1',
                  cat.bg,
                  cat.color,
                )}
              >
                {t(`category_${cat.key.toLowerCase()}`)}
              </span>
              {entry.googleEventId && (
                <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/30">
                  <Cloud className="h-3 w-3" />
                  Synced
                </span>
              )}
            </div>

            {/* Description */}
            {entry.description && (
              <div>
                <Label className="text-muted-foreground text-xs">{t('entry_description')}</Label>
                <p className="text-sm">{entry.description}</p>
              </div>
            )}

            {/* Linked task */}
            {entry.task && (
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-muted-foreground text-xs font-medium">Linked Task</p>
                <p className="text-sm font-medium">{entry.task.title}</p>
              </div>
            )}

            {/* AI reason */}
            {entry.isAiGenerated && entry.aiReason && (
              <div className="flex items-start gap-2 rounded-lg bg-violet-50 p-3 dark:bg-violet-900/10">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                <div>
                  <p className="text-xs font-medium text-violet-700 dark:text-violet-300">
                    AI Suggestion
                  </p>
                  <p className="text-muted-foreground text-xs">{entry.aiReason}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                className="mr-auto gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t('delete_entry')}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('close')}
            </Button>
            <Button type="button" onClick={switchToEdit} className="gap-2">
              <Pencil className="h-4 w-4" />
              {t('edit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // ── Edit Mode ──

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{entry ? t('edit_entry') : t('add_entry')}</DialogTitle>
          <DialogDescription>
            {defaultDate &&
              new Date(defaultDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <DialogBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('entry_title')}</Label>
              <Input id="title" {...register('title')} placeholder={t('entry_title_placeholder')} />
              {form.formState.errors.title && (
                <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('entry_description')}</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder={t('entry_desc_placeholder')}
                rows={2}
              />
            </div>

            {/* Category chips */}
            <div className="space-y-2">
              <Label>Category</Label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => {
                  const selected = watchCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setValue('category', cat.key, { shouldValidate: true })}
                      className={cn(
                        'rounded-lg px-2.5 py-1.5 text-xs font-medium ring-1 transition-all',
                        selected
                          ? `${cat.bg} ${cat.color}`
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted ring-transparent',
                      )}
                    >
                      {t(`category_${cat.key.toLowerCase()}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Native time picker */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startTime">{t('start_time')}</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register('startTime')}
                  className="tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">
                  {t('end_time')}
                  {duration && (
                    <span className="text-muted-foreground ml-2 text-xs font-normal">
                      ({duration})
                    </span>
                  )}
                </Label>
                <Input id="endTime" type="time" {...register('endTime')} className="tabular-nums" />
                {form.formState.errors.endTime && (
                  <p className="text-xs text-red-500">{form.formState.errors.endTime.message}</p>
                )}
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="gap-2 sm:gap-0">
            {entry && onDelete && mode === 'edit' && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
                className="mr-auto gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t('delete_entry')}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
