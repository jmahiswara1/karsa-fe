'use client';

import { TodaySchedule } from './TodaySchedule';
import { TodayFocus } from './TodayFocus';
import { UpcomingDeadlines } from './UpcomingDeadlines';
import { ActiveProjects } from './ActiveProjects';
import { RecentNotes } from './RecentNotes';

/**
 * Two-column dashboard layout:
 * - Left (3/5): schedule, focus, deadlines
 * - Right (2/5): projects, notes
 */
export function DashboardColumns() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      <div className="space-y-6 lg:col-span-3">
        <TodaySchedule />
        <TodayFocus />
        <UpcomingDeadlines />
      </div>
      <div className="space-y-6 lg:col-span-2">
        <ActiveProjects />
        <RecentNotes />
      </div>
    </div>
  );
}
