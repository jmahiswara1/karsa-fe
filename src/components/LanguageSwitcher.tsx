'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'id' : 'en';

    // Fallback to window.location.pathname to handle Next.js stale usePathname bug on Back navigation
    let currentPath = pathname;
    if (typeof window !== 'undefined') {
      const wPath = window.location.pathname;
      if (wPath === '/' || wPath === '/en' || wPath === '/id') {
        currentPath = '/';
      }
    }

    router.replace(currentPath, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
      title={locale === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-400"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
      {locale === 'en' ? 'EN' : 'ID'}
    </button>
  );
}
