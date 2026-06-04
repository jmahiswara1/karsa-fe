'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, FolderOpen, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextSidebarProps {
  onPromptSelect: (prompt: string) => void;
}

export function ContextSidebar({ onPromptSelect }: ContextSidebarProps) {
  const t = useTranslations('Assistant');

  const quickPrompts = [
    t('prompt_prioritize'),
    t('prompt_plan'),
    t('prompt_summary'),
  ];

  const contextItems = [
    { label: t('context_tasks'), value: 11, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: t('context_overdue'), value: 3, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { label: t('context_projects'), value: 2, icon: FolderOpen, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  ];

  return (
    <div className="flex w-full flex-col gap-6 lg:w-[320px] shrink-0">
      {/* Quick Prompts */}
      <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4">{t('quick_prompts_title')}</h3>
        <div className="flex flex-col gap-2">
          {quickPrompts.map((prompt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onPromptSelect(prompt)}
              className="group flex w-full items-center justify-between rounded-xl border border-border/40 bg-background px-4 py-3 text-left text-sm transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <span className="text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                {prompt}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Context Awareness */}
      <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-4">Workspace Context</h3>
        <div className="flex flex-col gap-3">
          {contextItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', item.bg)}>
                    <Icon className={cn('h-4 w-4', item.color)} />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-bold text-foreground">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
