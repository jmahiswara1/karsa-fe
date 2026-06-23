'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { useRouter, usePathname } from '@/i18n/routing';
import { useUpdatePreferences } from './use-preferences';

type PreferenceKey = 'language' | 'theme';

interface UsePreferenceSelectorResult {
  handleChange: (value: string | null, key: PreferenceKey) => void;
  isPending: boolean;
}

/**
 * Wraps the preference update mutation with toast feedback and side-effects:
 * - `language` change triggers `router.replace(pathname, { locale })`.
 * - `theme` change triggers `setTheme`.
 */
export function usePreferenceSelector(): UsePreferenceSelectorResult {
  const t = useTranslations('Settings');
  const updatePreferences = useUpdatePreferences();
  const { setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = useCallback(
    (value: string | null, key: PreferenceKey) => {
      if (!value) return;
      updatePreferences.mutate(
        { [key]: value },
        {
          onSuccess: () => {
            toast.success(t('save_success'));
            if (key === 'language') {
              router.replace(pathname, { locale: value as 'en' | 'id' });
            } else if (key === 'theme') {
              setTheme(value);
            }
          },
          onError: () => {
            toast.error(t('save_error'));
          },
        },
      );
    },
    [updatePreferences, t, router, pathname, setTheme],
  );

  return { handleChange, isPending: updatePreferences.isPending };
}
