'use client';

import { useTranslations } from 'next-intl';
import { ListChecks, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlannerGreetingCardProps {
  entryCount: number;
  date: Date;
  focusMessage?: string | null;
}

function getGreetingKey(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'greeting_morning';
  if (h >= 12 && h < 17) return 'greeting_afternoon';
  if (h >= 17 && h < 21) return 'greeting_evening';
  return 'greeting_morning';
}

export function PlannerGreetingCard({ entryCount, date, focusMessage }: PlannerGreetingCardProps) {
  const t = useTranslations('Focus');
  const greetingKey = getGreetingKey();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-2xl px-6 py-5 shadow-lg"
      style={{
        background:
          'linear-gradient(135deg, oklch(0.62 0.22 255) 0%, oklch(0.55 0.24 265) 50%, oklch(0.50 0.22 278) 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/8" />
      <div className="pointer-events-none absolute -right-4 -bottom-10 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">{t(greetingKey)}.</h1>
            <p className="text-sm font-medium text-white/60">
              {date.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          </div>

          <div className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/15 px-4 text-sm font-medium text-white/90 backdrop-blur-sm">
            <ListChecks className="h-4 w-4" />
            {entryCount}
          </div>
        </div>

        {/* AI focus message */}
        {focusMessage && (
          <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-white/80" />
            <p className="text-sm font-medium text-white/90">{focusMessage}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
