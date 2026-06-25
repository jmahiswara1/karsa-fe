'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { LogoutButton } from '../auth/LogoutButton';

export function NavbarClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const t = useTranslations('Navbar');
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: '#features', label: t('features') },
    { href: '#pricing', label: t('pricing') },
    { href: '#how-it-works', label: t('how_it_works') },
    { href: '#faq', label: t('faq') },
  ];

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
            priority
          />
          <span className="text-xl font-semibold tracking-tight text-gray-900">Karsa</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
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
              <>
                <Link
                  href="/login?returnTo=/"
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
                >
                  {t('log_in')}
                </Link>
                <Link
                  href="/login?returnTo=/"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
                >
                  {t('sign_up')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-gray-100 bg-white px-6 pb-6 md:hidden">
          <div className="flex flex-col gap-1 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="mb-3 md:hidden">
              <LanguageSwitcher />
            </div>
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="block w-full rounded-xl bg-blue-50 px-5 py-3 text-center text-sm font-medium text-blue-700 transition-all hover:bg-blue-100"
              >
                {t('go_to_dashboard')}
              </Link>
            ) : (
              <Link
                href="/login?returnTo=/"
                onClick={() => setOpen(false)}
                className="block w-full rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700"
              >
                {t('log_in')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
