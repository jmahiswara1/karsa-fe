'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function FeatureSection() {
  const t = useTranslations('Feature');
  return (
    <section className="bg-gray-50/50 px-6 py-24" id="features">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="mb-6 text-3xl leading-tight font-bold text-gray-900 md:text-5xl">
            {t('title_1')} <br />
            <span className="text-blue-600">{t('title_2')}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-500">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Feature 1 - Quick Capture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col rounded-[2rem] border border-gray-100 bg-gray-50 p-8 shadow-md md:p-12"
          >
            <div className="mb-8 flex h-16 w-16 -rotate-3 transform items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_8px_16px_rgba(37,99,235,0.3)] transition-transform hover:rotate-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">{t('card1_title')}</h3>
            <p className="mb-8 flex-grow text-gray-500">{t('card1_desc')}</p>
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-blue-50 blur-3xl" />
              <div className="relative z-10 flex flex-col gap-3">
                <div className="mb-2 flex items-center gap-2 border-b border-gray-100 pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t('sample_project')}</div>
                    <div className="text-xs font-medium text-gray-500">
                      {t('sample_tasks_count')}
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" x2="8" y1="13" y2="13" />
                      <line x1="16" x2="8" y1="17" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">{t('sample_doc1')}</span>
                  </div>
                  <span className="rounded bg-blue-100 px-2 py-1 text-[10px] font-bold tracking-wider text-blue-700 uppercase">
                    {t('sample_doc1_tag')}
                  </span>
                </div>
                <div className="flex w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-green-500 bg-green-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-400 line-through">
                      {t('sample_doc2')}
                    </span>
                  </div>
                  <span className="rounded bg-green-100 px-2 py-1 text-[10px] font-bold tracking-wider text-green-700 uppercase">
                    {t('sample_doc2_tag')}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2 - AI Daily Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col rounded-[2rem] border border-gray-100 bg-gray-50 p-8 shadow-md md:p-12"
          >
            <div className="mb-8 flex h-16 w-16 -rotate-3 transform items-center justify-center rounded-2xl bg-blue-600 text-white shadow-[0_8px_16px_rgba(37,99,235,0.3)] transition-transform hover:rotate-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
            <h3 className="mb-4 text-2xl font-bold text-gray-900">{t('card2_title')}</h3>
            <p className="mb-8 flex-grow text-gray-500">{t('card2_desc')}</p>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                    {t('sample_morning_focus')}
                  </span>
                  <span className="text-xs font-bold text-blue-600">{t('sample_time')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    1
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t('sample_task1')}</div>
                    <div className="mt-1 text-xs text-gray-500">{t('sample_task1_meta')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                    2
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t('sample_task2')}</div>
                    <div className="mt-1 text-xs text-gray-500">{t('sample_task2_meta')}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
