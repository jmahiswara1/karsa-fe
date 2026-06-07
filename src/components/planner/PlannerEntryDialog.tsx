'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Clock, Sparkles, Pencil, Trash2 } from 'lucide-react';
import type { PlannerEntry } from '@/hooks/use-planner';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

const schema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
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
  onSubmit: (data: FormData) => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

type DialogMode = 'view' | 'edit';

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
  const t = useTranslations('Planner');
  const [mode, setMode] = useState<DialogMode>('edit');

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      startTime: `${String(defaultHour).padStart(2, '0')}:00`,
      endTime: `${String(defaultHour + 1).padStart(2, '0')}:00`,
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
        });
      } else {
        setMode('edit');
        reset({
          title: '',
          description: '',
          startTime: `${String(defaultHour).padStart(2, '0')}:00`,
          endTime: `${String(defaultHour + 1).padStart(2, '0')}:00`,
        });
      }
    }
  }, [open, entry, defaultHour, reset]);

  const switchToEdit = () => setMode('edit');

  const watchStartTime = watch('startTime');
  const watchEndTime = watch('endTime');

  const getTimeParts = (time: string) => {
    const [h = '08', m = '00'] = time.split(':');
    return { hour: h, minute: m };
  };

  const handleTimeChange = (
    field: 'startTime' | 'endTime',
    part: 'hour' | 'minute',
    value: string,
  ) => {
    const current = getTimeParts(field === 'startTime' ? watchStartTime : watchEndTime);
    const newTime = part === 'hour' ? `${value}:${current.minute}` : `${current.hour}:${value}`;
    setValue(field, newTime, { shouldValidate: true });
  };

  // View Mode

  if (mode === 'view' && entry) {
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
            {/* Time */}
            <div className="bg-muted/30 flex items-center gap-3 rounded-xl p-3">
              <Clock className="text-muted-foreground h-5 w-5" />
              <div>
                <p className="text-sm font-medium">
                  {entry.startTime} - {entry.endTime}
                </p>
                <p className="text-muted-foreground text-xs">
                  {(() => {
                    const [sh, sm] = entry.startTime.split(':').map(Number);
                    const [eh, em] = entry.endTime.split(':').map(Number);
                    const dur = eh * 60 + em - (sh * 60 + sm);
                    const h = Math.floor(dur / 60);
                    const m = dur % 60;
                    return h > 0 ? `${h}h${m > 0 ? ` ${m}m` : ''}` : `${m}m`;
                  })()}
                </p>
              </div>
            </div>

            {/* Color indicator */}
            {entry.color && (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded" style={{ backgroundColor: entry.color }} />
                <span className="text-muted-foreground text-xs">Color</span>
              </div>
            )}

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

  // Edit Mode

  const startParts = getTimeParts(watchStartTime);
  const endParts = getTimeParts(watchEndTime);

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

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Time picker */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t('start_time')}</Label>
              <div className="flex gap-1">
                <Select
                  value={startParts.hour}
                  onValueChange={(v) => v && handleTimeChange('startTime', 'hour', v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground flex items-center">:</span>
                <Select
                  value={startParts.minute}
                  onValueChange={(v) => v && handleTimeChange('startTime', 'minute', v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MINUTES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('end_time')}</Label>
              <div className="flex gap-1">
                <Select
                  value={endParts.hour}
                  onValueChange={(v) => v && handleTimeChange('endTime', 'hour', v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-muted-foreground flex items-center">:</span>
                <Select
                  value={endParts.minute}
                  onValueChange={(v) => v && handleTimeChange('endTime', 'minute', v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MINUTES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {form.formState.errors.endTime && (
                <p className="text-xs text-red-500">{form.formState.errors.endTime.message}</p>
              )}
            </div>
          </div>

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
