import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Terms of Service
        </h1>
        <div className="mb-12 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>

        <div className="prose prose-blue max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing or using Karsa (&quot;the Service&quot;), you agree to be bound by these
              Terms of Service. If you do not agree to these terms, you may not access or use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">2. Description of Service</h2>
            <p className="leading-relaxed">
              Karsa is an AI-powered productivity tool designed to help users manage tasks, organize
              workflows, and schedule activities. We reserve the right to modify, suspend, or
              discontinue any part of the Service at any time, with or without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">3. User Accounts</h2>
            <p className="leading-relaxed">
              To use certain features of Karsa, you must register for an account. You are
              responsible for maintaining the confidentiality of your account credentials and for
              all activities that occur under your account. You agree to notify us immediately of
              any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">4. Acceptable Use</h2>
            <p className="leading-relaxed">
              You agree not to use the Service for any unlawful purpose or in any way that
              interrupts, damages, or impairs the Service. You shall not attempt to gain
              unauthorized access to our systems, scrape data, or distribute malicious code.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Intellectual Property</h2>
            <p className="leading-relaxed">
              All content, features, and functionality of Karsa, including but not limited to
              design, text, graphics, logos, and software, are the exclusive property of Karsa and
              are protected by copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">6. Limitation of Liability</h2>
            <p className="leading-relaxed">
              In no event shall Karsa or its developers be liable for any indirect, incidental,
              special, consequential, or punitive damages arising out of or related to your use of
              the Service, even if we have been advised of the possibility of such damages.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
