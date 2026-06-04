'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useDashboardSummary } from '@/hooks/use-dashboard';
import { Skeleton } from '@/components/ui/skeleton';

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
  const { data, isLoading } = useDashboardSummary();

  const notes = data?.recentNotes || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4.5 w-4.5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">{t('section_notes')}</h2>
        </div>
        <Link
          href="/notes"
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
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
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex h-16 items-start gap-4 rounded-2xl border border-border/40 bg-card p-4">
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))
        ) : notes.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-border/40 bg-card text-sm text-muted-foreground">
            No recent notes
          </div>
        ) : (
          notes.map((note: any) => (
            <motion.div
              key={note.id}
              variants={itemVariants}
              className="group flex items-start gap-4 rounded-2xl border border-border/40 bg-card p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.02)] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/20 cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                  {note.title}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground font-semibold">
                  {timeAgo(new Date(note.updatedAt))}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
