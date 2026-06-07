import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { cookies } from 'next/headers';
import { LogoutButton } from '../auth/LogoutButton';

export async function Navbar() {
  const t = await getTranslations('Navbar');
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has('access_token');

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Image
            src="/logo.png"
            alt="Karsa Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="text-xl font-semibold tracking-tight text-gray-900">Karsa</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            {t('features')}
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            {t('how_it_works')}
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            {t('faq')}
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-medium text-blue-700 transition-all hover:bg-blue-100 active:scale-95"
              >
                <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-blue-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4 text-blue-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {t('go_to_dashboard')}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login?returnTo=/"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
            >
              {t('log_in')}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
