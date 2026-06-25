import { getTranslations } from 'next-intl/server';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default async function TermsPage() {
  const t = await getTranslations('Legal');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          {t('terms_title')}
        </h1>
        <div className="mb-12 text-sm text-gray-500">
          {t('last_updated')} {new Date().toLocaleDateString()}
        </div>

        <div className="prose prose-blue max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms_s1_title')}</h2>
            <p className="leading-relaxed">{t('terms_s1_body')}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms_s2_title')}</h2>
            <p className="leading-relaxed">{t('terms_s2_body')}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms_s3_title')}</h2>
            <p className="leading-relaxed">{t('terms_s3_body')}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms_s4_title')}</h2>
            <p className="leading-relaxed">{t('terms_s4_body')}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms_s5_title')}</h2>
            <p className="leading-relaxed">{t('terms_s5_body')}</p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{t('terms_s6_title')}</h2>
            <p className="leading-relaxed">{t('terms_s6_body')}</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
