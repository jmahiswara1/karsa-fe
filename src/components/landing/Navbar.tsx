import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '../LanguageSwitcher';

export function Navbar() {
  const t = useTranslations('Navbar');

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
          <Link
            href="/login"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
          >
            {t('log_in')}
          </Link>
        </div>
      </div>
    </nav>
  );
}
