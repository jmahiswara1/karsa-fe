'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardSummary } from '@/hooks/use-dashboard';
import { cn } from '@/lib/utils';
import { MiniChat } from './MiniChat';

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

interface GreetingBannerProps {
  user: User | null;
}

export function GreetingBanner({ user }: GreetingBannerProps) {
  const t = useTranslations('Dashboard');
  const [isExpanded, setIsExpanded] = useState(false);

  // Read from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('minichat-expanded');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === 'true') setIsExpanded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('minichat-expanded', String(isExpanded));
    }
  }, [isExpanded]);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return t('greeting_morning');
    if (h >= 12 && h < 17) return t('greeting_afternoon');
    if (h >= 17 && h < 21) return t('greeting_evening');
    return t('greeting_night');
  };

  const greeting = getGreeting();
  const { data } = useDashboardSummary();

  const todayTasks = data?.todayTasks || [];
  const doneTasks = todayTasks.filter((t: { status: string }) => t.status === 'DONE').length;
  const totalTasks = todayTasks.length;

  return (
    <div className="space-y-0">
      <div
        className={cn(
          'relative overflow-hidden px-6 py-5 shadow-lg transition-all duration-300',
          isExpanded ? 'rounded-t-2xl' : 'rounded-2xl',
        )}
        style={{
          background:
            'linear-gradient(135deg, oklch(0.62 0.22 255) 0%, oklch(0.55 0.24 265) 50%, oklch(0.50 0.22 278) 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/8" />
        <div className="pointer-events-none absolute -right-4 -bottom-10 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between">
          {/* Left: Avatar + Text */}
          <div className="flex items-center gap-3.5">
            <Image
              src={
                user?.avatarUrl ??
                'https://res.cloudinary.com/dij8whzbd/image/upload/v1780472089/profile_odszu1.jpg'
              }
              alt={user?.name ?? 'Avatar'}
              width={44}
              height={44}
              className="rounded-full shadow-md ring-2 ring-white/25"
            />
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">{greeting}.</h1>
              <p className="text-sm font-medium text-white/60">{t('greeting_subtitle')}</p>
            </div>
          </div>

          {/* Right: Done today badge + Toggle button */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/15 px-4 text-sm font-medium text-white/90 backdrop-blur-sm">
              <CheckCircle2 className="h-4 w-4" />
              {doneTasks}/{totalTasks} done today
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/15 text-white/90 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/25 active:scale-95"
              aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
            >
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden rounded-b-2xl shadow-lg"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.64 0.19 255) 0%, oklch(0.58 0.20 265) 50%, oklch(0.54 0.18 278) 100%)',
        }}
      >
        <MiniChat userAvatar={user?.avatarUrl} />
      </motion.div>
    </div>
  );
}
