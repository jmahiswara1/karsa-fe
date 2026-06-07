'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Loader2 } from 'lucide-react';

import { GreetingBanner } from '@/components/dashboard/GreetingBanner';
import { InsightCards } from '@/components/dashboard/TaskSummary';
import { QuickActions } from '@/components/dashboard/QuickCapture';
import { TodaySchedule } from '@/components/dashboard/TodaySchedule';
import { TodayFocus } from '@/components/dashboard/TodayFocus';
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines';
import { ActiveProjects } from '@/components/dashboard/ActiveProjects';
import { RecentNotes } from '@/components/dashboard/RecentNotes';

export default function DashboardPage() {
  const { user, isLoading, fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Greeting + AI Input */}
      <GreetingBanner user={user} />

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
