import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { AiDemoSection } from '@/components/landing/AiDemoSection';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TeamWorkspaceSection } from '@/components/landing/TeamWorkspaceSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { Footer } from '@/components/landing/Footer';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : undefined,
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    alternates: {
      canonical: '/',
      languages: { en: '/en', id: '/id' },
    },
  };
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <HeroSection />
        <AiDemoSection />
        <StatsSection />
        <FeatureSection />
        <TeamWorkspaceSection />
        <HowItWorksSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
