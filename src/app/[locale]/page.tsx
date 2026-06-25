import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { AiDemoSection } from '@/components/landing/AiDemoSection';
import { FeatureSection } from '@/components/landing/FeatureSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main>
        <HeroSection />
        <AiDemoSection />
        <FeatureSection />
        <PricingSection />
        <HowItWorksSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
