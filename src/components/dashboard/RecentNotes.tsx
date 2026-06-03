'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, StickyNote } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { mockNotes } from './mock-data';

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.55 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function RecentNotes() {
  const t = useTranslations('Dashboard');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="text-primary h-4 w-4" />
          <h2 className="text-foreground text-sm font-semibold">{t('section_notes')}</h2>
        </div>
        <Link
          href="/notes"
          className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs font-medium transition-colors"
        >
          {t('view_all')}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Notes grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {mockNotes.map((note) => (
          <motion.div
            key={note.id}
            variants={itemVariants}
            className="group border-border/50 bg-card hover:border-primary/30 flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="bg-primary/8 dark:bg-primary/15 text-primary group-hover:bg-primary/15 dark:group-hover:bg-primary/25 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground group-hover:text-primary truncate text-sm font-medium transition-colors">
                {note.title}
              </p>
              <p className="text-muted-foreground mt-0.5 text-[11px] font-medium">
                {timeAgo(note.updatedAt)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
