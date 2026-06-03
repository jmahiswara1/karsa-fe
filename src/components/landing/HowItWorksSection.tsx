'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function HowItWorksSection() {
  const t = useTranslations('HowItWorks');
  return (
    <section className="mx-auto max-w-7xl px-6 py-24" id="how-it-works">
      <div className="mb-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-3xl font-extrabold text-gray-900 md:text-5xl"
        >
          {t('title_1')} <span className="text-blue-600">{t('title_2')}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-2xl text-lg text-gray-500"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Connecting Line (Desktop Only) */}
        <div className="absolute top-[4.5rem] right-[15%] left-[15%] z-0 hidden h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 md:block"></div>

        {/* Step 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full border-8 border-gray-50 bg-white shadow-xl">
            <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-blue-100 font-bold text-blue-600">
              1
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900">{t('step1_title')}</h3>
          <p className="px-4 text-sm leading-relaxed text-gray-500 md:text-base">
            {t('step1_desc')}
          </p>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <div className="relative mb-8 flex h-24 w-24 scale-110 transform items-center justify-center rounded-full border-8 border-blue-50 bg-blue-600 shadow-xl shadow-blue-600/30">
            <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full border-4 border-blue-50 bg-white font-bold text-blue-600">
              2
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="m12 14 4-4" />
              <path d="M3.34 19a10 10 0 1 1 17.32 0" />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900">{t('step2_title')}</h3>
          <p className="px-4 text-sm leading-relaxed text-gray-500 md:text-base">
            {t('step2_desc')}
          </p>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-full border-8 border-gray-50 bg-white shadow-xl">
            <div className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-blue-100 font-bold text-blue-600">
              3
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900">{t('step3_title')}</h3>
          <p className="px-4 text-sm leading-relaxed text-gray-500 md:text-base">
            {t('step3_desc')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
