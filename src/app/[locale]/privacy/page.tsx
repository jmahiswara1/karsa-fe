import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Privacy Policy
        </h1>
        <div className="mb-12 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>

        <div className="prose prose-blue max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            <p className="leading-relaxed">
              When you use Karsa, we may collect personal information such as your name, email
              address, and authentication data provided by third-party services (e.g., Google). We
              also collect data regarding your interaction with our application, including task
              entries, preferences, and usage analytics to improve our AI models.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed">
              Your data is primarily used to provide and enhance the Karsa service. Our AI analyzes
              your natural language inputs to organize and schedule your tasks efficiently. We do
              not use your personal task data to train public AI models, nor do we sell your
              personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">3. Data Security</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your personal information
              from unauthorized access, alteration, disclosure, or destruction. Your data is
              encrypted both in transit and at rest. However, no internet-based service can be 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">4. Third-Party Services</h2>
            <p className="leading-relaxed">
              Karsa integrates with third-party tools (such as Google Calendar, GitHub, and Linear)
              to enhance your workflow. By authorizing these integrations, you agree to their
              respective privacy policies. We only request the minimum permissions necessary for
              Karsa to function.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">5. Your Rights</h2>
            <p className="leading-relaxed">
              You have the right to access, update, or delete your personal information at any time.
              If you wish to permanently delete your Karsa account and associated data, you can do
              so through your account settings or by contacting our support team.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
