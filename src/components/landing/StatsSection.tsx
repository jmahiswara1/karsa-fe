'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function StatsSection() {
  const t = useTranslations('Stats');

  return (
    <section className="mx-auto max-w-5xl px-6 py-24 text-center" id="stats">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="mb-2 text-3xl leading-tight font-bold text-gray-900 md:text-5xl">
          {t('title_1')} <br className="hidden md:block" />
          <span className="text-blue-600">{t('title_2')}</span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 flex flex-col items-center justify-center gap-6 md:flex-row md:gap-8"
      >
        {/* Stat Card 1 */}
        <div className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white px-8 py-5 shadow-xl shadow-gray-200/50 md:w-auto">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-900">{t('stat1_value')}</div>
            <div className="text-xs font-medium text-gray-400">{t('stat1_label')}</div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white px-8 py-5 shadow-xl shadow-gray-200/50 md:w-auto">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-900">{t('stat2_value')}</div>
            <div className="text-xs font-medium text-gray-400">{t('stat2_label')}</div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white px-8 py-5 shadow-xl shadow-gray-200/50 md:w-auto">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-2xl font-bold text-gray-900">
              {t('stat3_value')}
              <span className="text-lg font-normal text-gray-400">{t('stat3_suffix')}</span>
            </div>
            <div className="text-xs font-medium text-gray-400">{t('stat3_label')}</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
