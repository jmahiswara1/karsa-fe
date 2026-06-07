'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { formatLocalDate } from '@/lib/date-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { MoodEnergySelector } from './MoodEnergySelector';

interface GeneratePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDate: Date;
  onGenerate: (data: { startDate: string; endDate: string; energy: string; mood: string }) => void;
  isGenerating: boolean;
}

export function GeneratePlanDialog({
  open,
  onOpenChange,
  defaultDate,
  onGenerate,
  isGenerating,
}: GeneratePlanDialogProps) {
  const t = useTranslations('Planner');

  const [startDate, setStartDate] = useState(formatLocalDate(defaultDate));
  const [endDate, setEndDate] = useState(formatLocalDate(defaultDate));
  const [energy, setEnergy] = useState('MEDIUM');
  const [mood, setMood] = useState('NEUTRAL');

  // Update default dates when dialog opens
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setStartDate(formatLocalDate(defaultDate));
      setEndDate(formatLocalDate(defaultDate));
    }
  }

  // Validate dates
  let error: string | null = null;
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    error = t('error_end_date_before_start');
  } else {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 7) {
      error = t('error_max_7_days');
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (error) return;

    onGenerate({
      startDate,
      endDate,
      energy,
      mood,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('generate_plan_title')}</DialogTitle>
          <DialogDescription>{t('generate_plan_desc')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <label className="text-sm leading-normal font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('start_date')}
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm leading-normal font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('end_date')}
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {error && <div className="text-sm font-medium text-red-500">{error}</div>}

          <div className="space-y-4 pt-2 pb-4">
            <MoodEnergySelector
              energy={energy}
              onEnergyChange={setEnergy}
              mood={mood}
              onMoodChange={setMood}
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isGenerating || !!error}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('generating')}
                </>
              ) : (
                t('generate_button')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
