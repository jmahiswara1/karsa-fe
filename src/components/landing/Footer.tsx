import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="px-6 pt-4 pb-16">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-12 md:flex-row">
        {/* Left Side: Brand and Social */}
        <div className="max-w-xs">
          <Link
            href="/"
            className="mb-4 flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="Karsa Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="text-xl font-extrabold tracking-tight text-gray-900">Karsa</span>
          </Link>
          <p className="mb-6 max-w-xs text-sm text-gray-500">{t('description')}</p>
          <div className="mb-6 flex items-center gap-4 text-gray-400">
            {/* Instagram */}
            <Link
              href="https://www.instagram.com/j.mahiswara_"
              target="_blank"
              className="transition-colors hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </Link>
            {/* LinkedIn */}
            <Link
              href="https://www.linkedin.com/in/gadangmahiswara/"
              target="_blank"
              className="transition-colors hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </Link>
            {/* Threads (Using AtSign as closest Lucide icon) */}
            <Link
              href="https://www.threads.com/@biasaa.ae"
              target="_blank"
              className="transition-colors hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4.8 8.4" />
              </svg>
            </Link>
            {/* GitHub */}
            <Link
              href="https://github.com/jmahiswara1"
              target="_blank"
              className="transition-colors hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0 .1-3.7s-1.2-.4-3.9 1.4a12.8 12.8 0 0 0-7 0C6.2 1.2 5 1.6 5 1.6a5.4 5.4 0 0 0 .1 3.7A5.4 5.4 0 0 0 3.6 9c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
                <path d="M9 18c-4.5 1.5-5-2.5-7-3" />
              </svg>
            </Link>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {t('rights')}
          </p>
        </div>

        {/* Right Side: Links */}
        <div className="flex flex-wrap gap-12 md:gap-20">
          <div>
            <h4 className="mb-5 text-sm font-bold text-gray-900">{t('product')}</h4>
            <ul className="flex flex-col gap-3.5">
              <li>
                <Link
                  href="#features"
                  className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                  {t('features')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-sm font-bold text-gray-900">{t('support')}</h4>
            <ul className="flex flex-col gap-3.5">
              <li>
                <Link
                  href="#faq"
                  className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                  {t('faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-5 text-sm font-bold text-gray-900">{t('legal')}</h4>
            <ul className="flex flex-col gap-3.5">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                >
                  {t('terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
