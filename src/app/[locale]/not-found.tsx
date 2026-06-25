import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24">
        {/* Decorative blue blurs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-50/80 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-sm text-center">
          <Image src="/logo.png" alt="Karsa" width={48} height={48} className="mx-auto mb-8" />

          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-8xl font-extrabold tracking-tight text-transparent">
            404
          </h1>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-gray-900">{t('title')}</h2>

          <p className="mt-2 text-sm leading-relaxed text-gray-500">{t('subtitle')}</p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_25px_rgba(37,99,235,0.4)] active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('back_home')}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
