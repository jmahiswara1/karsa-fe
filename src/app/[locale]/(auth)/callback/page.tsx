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
    const pending = searchParams.get('pending');
    const rejected = searchParams.get('rejected');
    const error = searchParams.get('error');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (pending === 'true') {
      router.replace('/pending');
      return;
    }

    if (rejected === 'true') {
      router.replace('/login?rejected=true');
      return;
    }

    if (error) {
      // Store error message and redirect to login
      sessionStorage.setItem('auth_error', error);
      router.replace('/login');
      return;
    }

    if (accessToken && refreshToken) {
      const secure = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `access_token=${accessToken}; path=/; max-age=${15 * 60}; SameSite=Lax${secure}`;
      document.cookie = `refresh_token=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${secure}`;

      const returnTo = sessionStorage.getItem('returnTo') || '/dashboard';
      sessionStorage.removeItem('returnTo');

      router.replace(returnTo);
    } else {
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
