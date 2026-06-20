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
  DialogBody,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Palette } from 'lucide-react';
import { useCreateTaskColumn } from '@/hooks/use-tasks';
import { useBoardColors } from '@/hooks/use-board-colors';
import { BOARD_COLOR_PRESETS, type BoardColor } from './board-colors';
import { cn } from '@/lib/utils';

interface CreateBoardFormData {
  name: string;
  color: BoardColor;
}

interface CreateBoardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBoardDialog({ open, onOpenChange }: CreateBoardDialogProps) {
  const t = useTranslations('Tasks');
  const createColumn = useCreateTaskColumn();
  const { setColor } = useBoardColors();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateBoardFormData>({
    defaultValues: { name: '', color: 'neutral' },
  });

  const selectedColor = watch('color');

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({ name: '', color: 'neutral' });
    }
  }, [open, reset]);

  const onSubmit = (data: CreateBoardFormData) => {
    createColumn.mutate(data.name.trim(), {
      onSuccess: (newBoard: { id: string }) => {
        setColor(newBoard.id, data.color);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('board_create_title')}</DialogTitle>
          <DialogDescription>{t('board_create_desc')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogBody className="space-y-6 pb-6">
            <div className="space-y-3">
              <Label htmlFor="board-name" className="text-sm font-medium">
                {t('board_name_label')}
              </Label>
              <Input
                id="board-name"
                autoFocus
                placeholder={t('board_name_placeholder')}
                maxLength={50}
                className="h-11"
                aria-invalid={!!errors.name}
                {...register('name', {
                  required: t('board_name_required'),
                  maxLength: { value: 50, message: t('board_name_too_long') },
                })}
              />
              {errors.name && (
                <p className="text-xs text-foreground/70">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                <Palette className="h-3.5 w-3.5 mr-1.5 inline" />
                {t('board_color_label')}
              </Label>
              <div className="grid grid-cols-5 gap-3">
                {BOARD_COLOR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setValue('color', p.id, { shouldValidate: true })}
                    className={cn(
                      'rounded-lg border-2 p-4 flex flex-col items-center gap-2 transition-all hover:bg-muted/50',
                      selectedColor === p.id
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'border-border',
                    )}
                    aria-pressed={selectedColor === p.id}
                  >
                    <span className={cn('h-8 w-8 rounded-full', p.swatch)} />
                    <span className="text-[11px] font-medium">{t(p.i18nKey)}</span>
                  </button>
                ))}
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" disabled={createColumn.isPending} />}>
              {t('cancel')}
            </DialogClose>
            <Button type="submit" disabled={createColumn.isPending} className="min-w-[120px]">
              {createColumn.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              )}
              {t('board_create_button')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
