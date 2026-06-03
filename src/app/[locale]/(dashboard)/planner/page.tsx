import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { CalendarDays } from 'lucide-react';

export default function PlannerPage() {
  const tPages = useTranslations('Pages');

  return (
    <div className="space-y-6">
      <PageHeader title={tPages('planner_title')} description={tPages('planner_desc')} />
      <EmptyState
        icon={CalendarDays}
        title={tPages('coming_soon')}
        description={tPages('coming_soon_desc')}
      />
    </div>
  );
}
