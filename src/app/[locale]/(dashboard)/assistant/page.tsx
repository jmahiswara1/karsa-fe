import { useTranslations } from 'next-intl';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { Sparkles } from 'lucide-react';

export default function AssistantPage() {
  const tPages = useTranslations('Pages');

  return (
    <div className="space-y-6">
      <PageHeader title={tPages('assistant_title')} description={tPages('assistant_desc')} />
      <EmptyState
        icon={Sparkles}
        title={tPages('coming_soon')}
        description={tPages('coming_soon_desc')}
      />
    </div>
  );
}
