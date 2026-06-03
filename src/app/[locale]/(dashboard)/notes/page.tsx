import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { FileText } from 'lucide-react';

export default function NotesPage() {
  const tPages = useTranslations('Pages');

  return (
    <div className="space-y-6">
      <PageHeader title={tPages('notes_title')} description={tPages('notes_desc')} />
      <EmptyState
        icon={FileText}
        title={tPages('coming_soon')}
        description={tPages('coming_soon_desc')}
      />
    </div>
  );
}
