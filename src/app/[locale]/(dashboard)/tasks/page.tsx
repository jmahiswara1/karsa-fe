import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { CheckSquare } from 'lucide-react';

export default function TasksPage() {
  const tPages = useTranslations('Pages');

  return (
    <div className="space-y-6">
      <PageHeader title={tPages('tasks_title')} description={tPages('tasks_desc')} />
      <EmptyState
        icon={CheckSquare}
        title={tPages('coming_soon')}
        description={tPages('coming_soon_desc')}
      />
    </div>
  );
}
