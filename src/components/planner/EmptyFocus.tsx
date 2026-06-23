'use client';

import { useTranslations } from 'next-intl';
import { ListChecks, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface EmptyFocusProps {
  onSuggest: () => void;
  onAdd: () => void;
  isGenerating: boolean;
}

export function EmptyFocus({ onSuggest, onAdd, isGenerating }: EmptyFocusProps) {
  const t = useTranslations('Focus');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-border/60 bg-muted/20 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed py-16"
    >
      <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
        <ListChecks className="text-muted-foreground h-7 w-7" />
      </div>
      <div className="text-center">
        <p className="text-foreground text-sm font-semibold">{t('empty_no_priorities')}</p>
        <p className="text-muted-foreground mt-1 text-xs">{t('empty_no_priorities_hint')}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onAdd} className="gap-1.5">
          {t('action_add_focus')}
        </Button>
        <Button size="sm" onClick={onSuggest} disabled={isGenerating} className="gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          {isGenerating ? t('generating') : t('action_suggest')}
        </Button>
      </div>
    </motion.div>
  );
}
