'use client';

import { useTranslations } from 'next-intl';
import { SunMoon } from 'lucide-react';
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

interface ThemePreferenceProps {
  value?: string;
  isLoading: boolean;
}

export function ThemePreference({ value, isLoading }: ThemePreferenceProps) {
  const t = useTranslations('Settings');
  const { handleChange } = usePreferenceSelector();

  return (
    <PreferenceCard
      icon={<SunMoon className="text-primary h-5 w-5" />}
      title={t('theme_title')}
      description={t('theme_desc')}
      delay={0.1}
    >
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <Select value={value || 'system'} onValueChange={(v) => handleChange(v, 'theme')}>
          <SelectTrigger>
            <SelectValue>
              {value === 'light'
                ? t('theme_light')
                : value === 'dark'
                  ? t('theme_dark')
                  : t('theme_system')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">{t('theme_light')}</SelectItem>
            <SelectItem value="dark">{t('theme_dark')}</SelectItem>
            <SelectItem value="system">{t('theme_system')}</SelectItem>
          </SelectContent>
        </Select>
      )}
    </PreferenceCard>
  );
}
