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
    iconColor: 'text-muted-foreground',
  },
  {
    key: 'new_note',
    href: '/notes',
    icon: FileText,
    iconColor: 'text-emerald-500',
  },
  {
    key: 'planner',
    href: '/planner',
    icon: CalendarRange,
    iconColor: 'text-violet-500',
  },
  {
    key: 'ai',
    href: '/assistant',
    icon: Sparkles,
    iconColor: 'text-amber-500',
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
                'group border-border/50 bg-card flex flex-col items-center gap-3 rounded-2xl border px-4 py-5 shadow-sm transition-all duration-200',
                'hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md',
              )}
            >
              <div className="bg-muted/60 group-hover:bg-primary/10 flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 group-hover:scale-110">
                <Icon
                  className={cn(
                    'h-5 w-5 transition-colors',
                    action.iconColor,
                    'group-hover:text-primary',
                  )}
                />
              </div>
              <span className="text-foreground group-hover:text-primary text-xs font-semibold transition-colors">
                {t(`quick_action_${action.key}` as any)}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
