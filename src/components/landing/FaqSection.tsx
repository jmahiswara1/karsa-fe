'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

const faqIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function FaqSection() {
  const t = useTranslations('Faq');
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqIndices.map((i) => ({
      '@type': 'Question',
      name: t(`q${i}`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(`a${i}`),
      },
    })),
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-24" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-6 text-3xl font-extrabold text-gray-900 md:text-5xl"
        >
          {t('title_1')} <span className="text-blue-600">{t('title_2')}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-500"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      <div className="space-y-4">
        {faqIndices.map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 * i }}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
              aria-controls={`faq-panel-${i}`}
              className="flex w-full items-center justify-between px-6 py-5 text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span id={`faq-question-${i}`} className="font-bold text-gray-900">
                {t(`q${i}`)}
              </span>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-50 transition-transform duration-300 ${openIndex === i ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-gray-400'}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <div className="px-6 pb-6 leading-relaxed text-gray-500">{t(`a${i}`)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
