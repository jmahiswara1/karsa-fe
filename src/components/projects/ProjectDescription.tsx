'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface ProjectDescriptionProps {
  description: string;
}

export function ProjectDescription({ description }: ProjectDescriptionProps) {
  const t = useTranslations('Projects');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="border-border/50 bg-card rounded-xl border p-5"
    >
      <h3 className="mb-2 text-sm font-semibold">{t('description')}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
        {description}
      </p>
    </motion.div>
  );
}
