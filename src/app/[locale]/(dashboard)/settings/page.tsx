'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { Globe, SunMoon } from 'lucide-react';

import { useAuthStore } from '@/store/auth.store';
import { usePreferencesQuery, useUpdatePreferences } from '@/hooks/use-preferences';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { ProfileBanner } from '@/components/settings/ProfileBanner';
import { PreferenceCard } from '@/components/settings/PreferenceCard';
import { SettingsFooter } from '@/components/settings/SettingsFooter';
import { useRouter, usePathname } from '@/i18n/routing';
import { toast } from 'sonner';

export default function SettingsPage() {
  const tPages = useTranslations('Pages');
  const tSettings = useTranslations('Settings');
  useAuthStore();
  const { data: preferences, isLoading: isPrefLoading } = usePreferencesQuery();
  const updatePreferences = useUpdatePreferences();
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLanguageChange = (value: string | null) => {
    if (!value) return;
    updatePreferences.mutate(
      { language: value },
      {
        onSuccess: () => {
          toast.success(tSettings('save_success'));
          router.replace(pathname, { locale: value as 'en' | 'id' });
        },
        onError: () => {
          toast.error(tSettings('save_error'));
        },
      },
    );
  };

  const handleThemeChange = (value: string | null) => {
    if (!value) return;
    updatePreferences.mutate(
      { theme: value },
      {
        onSuccess: () => {
          toast.success(tSettings('save_success'));
          setTheme(value);
        },
        onError: () => {
          toast.error(tSettings('save_error'));
        },
      },
    );
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <PageHeader title={tPages('settings_title')} description={tPages('settings_desc')} />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={tPages('settings_title')} description={tPages('settings_desc')} />

      <ProfileBanner />

      <div className="mt-8 mb-4">
        <h2 className="text-lg font-semibold">{tSettings('preferences_title')}</h2>
        <p className="text-muted-foreground text-sm">{tSettings('preferences_subtitle')}</p>
      </div>

      <PreferenceCard
        icon={<Globe className="text-primary h-5 w-5" />}
        title={tSettings('language_title')}
        description={tSettings('language_desc')}
        delay={0}
      >
        {isPrefLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={preferences?.language || 'id'} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue>
                {preferences?.language === 'id'
                  ? tSettings('language_id')
                  : tSettings('language_en')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">{tSettings('language_id')}</SelectItem>
              <SelectItem value="en">{tSettings('language_en')}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </PreferenceCard>

      <PreferenceCard
        icon={<SunMoon className="text-primary h-5 w-5" />}
        title={tSettings('theme_title')}
        description={tSettings('theme_desc')}
        delay={0.1}
      >
        {isPrefLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={preferences?.theme || 'system'} onValueChange={handleThemeChange}>
            <SelectTrigger>
              <SelectValue>
                {preferences?.theme === 'light'
                  ? tSettings('theme_light')
                  : preferences?.theme === 'dark'
                    ? tSettings('theme_dark')
                    : tSettings('theme_system')}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">{tSettings('theme_light')}</SelectItem>
              <SelectItem value="dark">{tSettings('theme_dark')}</SelectItem>
              <SelectItem value="system">{tSettings('theme_system')}</SelectItem>
            </SelectContent>
          </Select>
        )}
      </PreferenceCard>

      <SettingsFooter />
    </div>
  );
}
