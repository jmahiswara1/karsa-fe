'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Auth');

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken && refreshToken) {
      // Store tokens in cookies so Next.js server components and middleware can read them
      document.cookie = `access_token=${accessToken}; path=/; max-age=${15 * 60}; SameSite=Lax`; // 15 mins
      document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`; // 7 days

      // Check if we need to redirect to a specific page
      const returnTo = sessionStorage.getItem('returnTo') || '/dashboard';
      sessionStorage.removeItem('returnTo');

      router.replace(returnTo);
    } else {
      // If no tokens, redirect back to login
      router.replace('/login');
    }
  }, [searchParams, router]);

  return (
    <div className="flex w-full flex-col items-center justify-center py-24">
      <Loader2 className="mb-6 h-12 w-12 animate-spin text-blue-600" />
      <h2 className="mb-2 text-2xl font-semibold text-gray-900">
        {t('login_loading') || 'Authenticating...'}
      </h2>
      <p className="text-gray-500">Please wait while we set up your secure session.</p>
    </div>
  );
}
