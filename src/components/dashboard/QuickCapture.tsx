/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function QuickActions() {
  const t = useTranslations('Dashboard');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.div key={action.key} variants={itemVariants}>
            <Link
              href={action.href}
              className={cn(
                'group flex flex-col items-center gap-3 rounded-2xl border border-border/40 bg-card py-5 px-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all duration-200',
                'hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20',
              )}
            >
              <div className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110',
                action.bgColor,
                'group-hover:bg-primary/10'
              )}>
                <Icon className={cn('h-5 w-5 transition-colors', action.iconColor, 'group-hover:text-primary')} />
              </div>
              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                {t(`quick_action_${action.key}` as any)}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
