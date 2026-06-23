'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { useDashboardSummary } from '@/hooks/use-dashboard';
import { PageBanner } from '@/components/shared/PageBanner';
import { MiniChat } from '@/components/dashboard/MiniChat';
import { InsightCards } from '@/components/dashboard/TaskSummary';
import { QuickActions } from '@/components/dashboard/QuickCapture';
import { TodaySchedule } from '@/components/dashboard/TodaySchedule';
import { TodayFocus } from '@/components/dashboard/TodayFocus';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { ActiveProjects } from '@/components/dashboard/ActiveProjects';
import { RecentNotes } from '@/components/dashboard/RecentNotes';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const { user, fetchProfile } = useAuthStore();
  const { data } = useDashboardSummary();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('minichat-expanded');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored === 'true') setIsExpanded(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('minichat-expanded', String(isExpanded));
    }
  }, [isExpanded]);

  const todayTasks = data?.todayTasks || [];
  const doneTasks = todayTasks.filter((t: { status: string }) => t.status === 'DONE').length;
  const totalTasks = todayTasks.length;

  const rightSlot = (
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
  );

  const bottomSlot = (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? 'auto' : 0,
        opacity: isExpanded ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="overflow-hidden"
    >
      <MiniChat userAvatar={user?.avatarUrl} />
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Greeting + MiniChat */}
      <PageBanner
        user={user}
        subtitle={t('greeting_subtitle')}
        rightSlot={rightSlot}
        bottomSlot={bottomSlot}
      />

      {/* Quick Stats */}
      <InsightCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content: 2 columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Left column: Tasks + Deadlines */}
        <div className="space-y-6 lg:col-span-3">
          <TodaySchedule />
          <TodayFocus />
          <UpcomingDeadlines />
        </div>

        {/* Right column: Projects + Notes */}
        <div className="space-y-6 lg:col-span-2">
          <ActiveProjects />
          <RecentNotes />
        </div>
      </div>
    </div>
  );
}
