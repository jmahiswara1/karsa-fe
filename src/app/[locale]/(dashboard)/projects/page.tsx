import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { FolderOpen } from 'lucide-react';

export default function ProjectsPage() {
  const tPages = useTranslations('Pages');

  return (
    <div className="space-y-6">
      <PageHeader title={tPages('projects_title')} description={tPages('projects_desc')} />
      <EmptyState
        icon={FolderOpen}
        title={tPages('coming_soon')}
        description={tPages('coming_soon_desc')}
      />
    </div>
  );
}
