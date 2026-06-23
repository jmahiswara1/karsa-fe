'use client';

import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PreferenceCard } from './PreferenceCard';
import { usePreferenceSelector } from '@/hooks/use-preference-selector';

interface LanguagePreferenceProps {
  value?: string;
  isLoading: boolean;
}

export function LanguagePreference({ value, isLoading }: LanguagePreferenceProps) {
  const t = useTranslations('Settings');
  const { handleChange } = usePreferenceSelector();

  return (
    <PreferenceCard
      icon={<Globe className="text-primary h-5 w-5" />}
      title={t('language_title')}
      description={t('language_desc')}
      delay={0}
    >
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select value={value || 'id'} onValueChange={(v) => handleChange(v, 'language')}>
          <SelectTrigger>
            <SelectValue>{value === 'id' ? t('language_id') : t('language_en')}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="id">{t('language_id')}</SelectItem>
            <SelectItem value="en">{t('language_en')}</SelectItem>
          </SelectContent>
        </Select>
      )}
    </PreferenceCard>
  );
}
