'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerTriggerProps {
  date: Date;
  onSelect: (date: Date) => void;
}

function getMonthDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

const DAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function DatePickerTrigger({ date, onSelect }: DatePickerTriggerProps) {
  const t = useTranslations('Focus');
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(date));

  const days = getMonthDays(viewDate.getFullYear(), viewDate.getMonth());
  const todayStr = new Date().toDateString();
  const selectedStr = date.toDateString();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="hover:bg-muted flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors"
      >
        {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="bg-popover ring-border/10 absolute top-full left-1/2 z-50 mt-2 w-64 -translate-x-1/2 rounded-xl p-3 shadow-lg ring-1">
            {/* Month nav */}
            <div className="flex items-center justify-between pb-2">
              <button
                type="button"
                onClick={() =>
                  setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
                }
                className="hover:bg-muted flex h-7 w-7 items-center justify-center rounded-md transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold">
                {viewDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                onClick={() =>
                  setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
                }
                className="hover:bg-muted flex h-7 w-7 items-center justify-center rounded-md transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 pb-1">
              {DAY_NAMES.map((name) => (
                <div
                  key={name}
                  className="text-muted-foreground text-center text-[10px] font-medium"
                >
                  {name}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {days.map((d, i) => {
                if (!d) return <div key={`pad-${i}`} />;
                const isToday = d.toDateString() === todayStr;
                const isSelected = d.toDateString() === selectedStr;
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    onClick={() => {
                      onSelect(d);
                      setOpen(false);
                    }}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors',
                      isSelected && 'bg-primary text-primary-foreground font-bold',
                      !isSelected && isToday && 'ring-primary/30 ring-1',
                      !isSelected && !isToday && 'hover:bg-muted',
                    )}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Today button */}
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onSelect(today);
                setViewDate(today);
                setOpen(false);
              }}
              className="text-primary hover:bg-muted mt-2 w-full rounded-md py-1.5 text-xs font-medium transition-colors"
            >
              {t('date_picker_today')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
