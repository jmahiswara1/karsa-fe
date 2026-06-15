/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTranslations } from 'next-intl';
import { Plus, FileText, CalendarRange, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const actions = [
  {
    key: 'new_task',
    href: '/tasks',
    icon: Plus,
    iconColor: 'text-slate-500',
    bgColor: 'bg-slate-50 dark:bg-slate-900',
  },
  {
    key: 'new_note',
    href: '/notes',
    icon: FileText,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/30',
  },
  {
    key: 'planner',
    href: '/planner',
    icon: CalendarRange,
    iconColor: 'text-violet-500',
    bgColor: 'bg-violet-50 dark:bg-violet-900/30',
  },
  {
    key: 'ai',
    href: '/assistant',
    icon: Sparkles,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
  },
] as const;

export function QuickActions() {
  const t = useTranslations('Dashboard');

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <div key={action.key}>
            <Link
              href={action.href}
              className={cn(
                'group border-border/40 bg-card flex flex-col items-center gap-3 rounded-2xl border px-4 py-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all duration-200',
                'hover:border-primary/20 hover:-translate-y-0.5 hover:shadow-md',
              )}
            >
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110',
                  action.bgColor,
                  'group-hover:bg-primary/10',
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    action.iconColor,
                    'group-hover:text-primary',
                  )}
                />
              </div>
              <span className="text-foreground group-hover:text-primary text-xs font-bold transition-colors">
                {t(`quick_action_${action.key}` as any)}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
