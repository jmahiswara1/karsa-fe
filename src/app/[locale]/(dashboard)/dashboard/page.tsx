'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth.store';
import { useDashboardSummary } from '@/hooks/use-dashboard';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardColumns } from '@/components/dashboard/DashboardColumns';
import { InsightCards } from '@/components/dashboard/TaskSummary';
import { QuickActions } from '@/components/dashboard/QuickCapture';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const { user, fetchProfile } = useAuthStore();
  const { data } = useDashboardSummary();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const todayTasks = data?.todayTasks || [];
  const doneTasks = todayTasks.filter((t: { status: string }) => t.status === 'DONE').length;
  const totalTasks = todayTasks.length;

  return (
    <div className="space-y-6 pb-8">
      <DashboardHeader
        user={user}
        subtitle={t('greeting_subtitle')}
        doneTasks={doneTasks}
        totalTasks={totalTasks}
      />

      <InsightCards />
      <QuickActions />
      <DashboardColumns />
    </div>
  );
}
