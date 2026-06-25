'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function CtaSection() {
  const t = useTranslations('Cta');
  return (
    <section className="mx-auto max-w-7xl px-6 pt-24 pb-8" id="cta">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7 }}
        className="relative flex flex-col items-center justify-between overflow-hidden rounded-[2rem] bg-blue-600 px-8 py-8 shadow-xl md:flex-row md:px-14 md:py-10"
      >
        {/* Background Decorative Element */}
        <div className="pointer-events-none absolute top-0 right-0 z-0 h-full w-full overflow-hidden">
          <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-y-1/2 rounded-full bg-blue-500/20 blur-[80px]"></div>
        </div>

        {/* Left Side: Text and Buttons */}
        <div className="relative z-10 mb-6 w-full max-w-xl md:mb-0 md:pr-6">
          <h2 className="mb-3 text-3xl leading-tight font-extrabold tracking-tight text-white md:text-4xl">
            {t('title_1')}{' '}
            <span className="font-serif font-normal italic opacity-90">{t('title_2')}</span>
            {t('title_3')}
          </h2>
          <p className="mb-6 max-w-[400px] text-base text-blue-100">{t('subtitle')}</p>

          <div className="flex flex-col items-start gap-4 sm:flex-row">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-bold text-blue-900 shadow-[0_8px_20px_rgba(255,255,255,0.1)] transition-all hover:bg-gray-50"
            >
              {t('button')}
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
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Side: Phone Mockup */}
        <div className="relative z-10 hidden h-[220px] w-full flex-shrink-0 justify-center sm:flex md:h-[240px] md:w-[260px] md:justify-end">
          {/* Phone Body */}
          <motion.div
            initial={{ y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
            className="absolute top-4 flex h-[480px] w-[240px] flex-col overflow-hidden rounded-[2.5rem] border-[6px] border-gray-900 bg-white shadow-2xl md:top-8"
          >
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 z-20 h-5 w-28 -translate-x-1/2 rounded-b-xl bg-gray-900"></div>

            {/* Phone Screen Content */}
            <div className="flex flex-1 flex-col gap-5 bg-gray-50 px-5 pt-12 pb-6">
              {/* Header */}
              <div>
                <div className="text-xs font-medium text-gray-500">Hello,</div>
                <div className="text-xl font-extrabold text-gray-900">Gadang Mahiswara</div>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 rounded-full bg-gray-200/50 p-1">
                <div className="flex-1 rounded-full bg-white py-1.5 text-center text-xs font-bold text-gray-900 shadow-sm">
                  Today
                </div>
                <div className="flex-1 rounded-full py-1.5 text-center text-xs font-bold text-gray-500">
                  Upcoming
                </div>
              </div>

              {/* Focus Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-[#0f2e73] p-4 text-white">
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-blue-500/30 blur-xl"></div>
                <div className="relative z-10">
                  <div className="mb-1 text-xs font-bold text-blue-200">Morning Focus</div>
                  <div className="mb-3 text-sm leading-tight font-bold">
                    Product Strategy <br /> Review
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold">
                      2h 30m
                    </span>
                    <span className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold">
                      High Priority
                    </span>
                  </div>
                </div>
              </div>

              {/* Task List */}
              <div>
                <div className="mb-3 text-xs font-bold text-gray-900">Tasks</div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-blue-500"></div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Update PRD document</div>
                      <div className="mt-0.5 text-[10px] text-gray-400">10:00 AM • Document</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                    <div className="mt-0.5 h-4 w-4 rounded-full border-2 border-gray-300"></div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Design team sync</div>
                      <div className="mt-0.5 text-[10px] text-gray-400">1:00 PM • Meeting</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Nav */}
            <div className="z-20 flex h-16 items-center justify-around border-t border-gray-100 bg-white px-2">
              <div className="flex h-8 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M12 2L2 12h20L12 2z" opacity="0" />
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <div className="flex h-8 w-12 items-center justify-center text-gray-400">
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="flex h-8 w-12 items-center justify-center text-gray-400">
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
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
