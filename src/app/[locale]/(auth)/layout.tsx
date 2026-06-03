import { ReactNode } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { AuthCarousel } from '@/components/auth/AuthCarousel';

export default async function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white p-4 md:p-6 lg:p-8">
      {/* Absolute Language Switcher at Top Right */}
      <div className="absolute top-8 right-8 z-50">
        <LanguageSwitcher />
      </div>

      <div className="flex w-full overflow-hidden rounded-3xl">
        {/* Left Column - Karsa Branding (Blue Box) */}
        <div className="relative hidden w-1/2 flex-col justify-end overflow-hidden rounded-3xl bg-blue-600 p-12 text-white lg:flex">
          {/* Decorative Blur */}
          <div className="absolute top-0 right-0 z-0 h-[600px] w-[600px] translate-x-1/4 -translate-y-1/4 rounded-full bg-blue-500/50 blur-[80px]"></div>

          {/* Carousel Slider */}
          <AuthCarousel />
        </div>

        {/* Right Column - Form */}
        <div className="flex w-full flex-col items-center justify-center bg-white p-8 md:p-12 lg:w-1/2">
          {/* Logo & Brand Name Centered Above Form */}
          <Link
            href="/"
            className="mb-12 flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo.png"
              alt="Karsa Logo"
              width={36}
              height={36}
              className="object-contain"
            />
            <span className="text-2xl font-semibold tracking-tight text-gray-900">Karsa</span>
          </Link>

          {/* Form Container */}
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
