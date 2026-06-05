'use client';

import { useEffect } from 'react';
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
import type { PlannerEntry } from '@/hooks/use-planner';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:MM'),
});

type FormData = z.infer<typeof schema>;

interface PlannerEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: PlannerEntry | null;
  defaultHour: number;
  onSubmit: (data: FormData) => void;
  onDelete?: () => void;
  isSubmitting: boolean;
}

export function PlannerEntryDialog({
  open,
  onOpenChange,
  entry,
  defaultHour,
  onSubmit,
  onDelete,
  isSubmitting,
}: PlannerEntryDialogProps) {
  const t = useTranslations('Planner');

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      startTime: `${String(defaultHour).padStart(2, '0')}:00`,
      endTime: `${String(defaultHour + 1).padStart(2, '0')}:00`,
    },
  });

  useEffect(() => {
    if (open) {
      if (entry) {
        form.reset({
          title: entry.title,
          description: entry.description || '',
          startTime: entry.startTime,
          endTime: entry.endTime,
        });
      } else {
        form.reset({
          title: '',
          description: '',
          startTime: `${String(defaultHour).padStart(2, '0')}:00`,
          endTime: `${String(defaultHour + 1).padStart(2, '0')}:00`,
        });
      }
    }
  }, [open, entry, defaultHour, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{entry ? t('edit_entry') : t('add_entry')}</DialogTitle>
          <DialogDescription>
            {entry ? t('edit_entry_desc') : t('add_entry_desc')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('entry_title')}</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder={t('entry_title_placeholder')}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('entry_description')}</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder={t('entry_desc_placeholder')}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startTime">{t('start_time')}</Label>
              <Input id="startTime" {...form.register('startTime')} placeholder="08:00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">{t('end_time')}</Label>
              <Input id="endTime" {...form.register('endTime')} placeholder="09:00" />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {entry && onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete} className="mr-auto">
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
