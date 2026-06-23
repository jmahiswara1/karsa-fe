'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth.store';
import { usePreferencesQuery } from '@/hooks/use-preferences';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileBanner } from '@/components/settings/ProfileBanner';
import { SubscriptionCard } from '@/components/settings/SubscriptionCard';
import { LanguagePreference } from '@/components/settings/LanguagePreference';
import { ThemePreference } from '@/components/settings/ThemePreference';
import { SettingsFooter } from '@/components/settings/SettingsFooter';

export default function SettingsPage() {
  const tPages = useTranslations('Pages');
  const tSettings = useTranslations('Settings');
  const { user } = useAuthStore();
  const { data: preferences, isLoading: isPrefLoading } = usePreferencesQuery();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">
          {tPages('settings_title')}
        </h1>
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-foreground text-2xl font-semibold tracking-tight">
        {tPages('settings_title')}
      </h1>

      <ProfileBanner />

      <SubscriptionCard user={user} />

      <div className="mt-8 mb-4">
        <h2 className="text-lg font-semibold">{tSettings('preferences_title')}</h2>
        <p className="text-muted-foreground text-sm">{tSettings('preferences_subtitle')}</p>
      </div>

      <LanguagePreference value={preferences?.language} isLoading={isPrefLoading} />
      <ThemePreference value={preferences?.theme} isLoading={isPrefLoading} />

      <SettingsFooter />
    </div>
  );
}
