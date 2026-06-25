/* eslint-disable @next/next/no-img-element */
'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('Hero');

  return (
    <section className="mx-auto max-w-7xl px-6 pt-12 pb-24" id="home">
      <div className="grid grid-cols-1 gap-8 lg:min-h-[600px] lg:grid-cols-2 lg:gap-8">
        {/* Left Column */}
        <div className="relative flex h-full flex-col">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 text-4xl leading-[1.05] font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-7xl"
          >
            {t('title_1')} <br className="hidden md:block" /> {t('title_2')}{' '}
            <br className="hidden md:block" />{' '}
            <span
              className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text pr-2 pb-2 text-transparent"
              style={{
                fontFamily: 'var(--font-caveat), cursive',
                fontSize: '1.3em',
                display: 'inline-block',
              }}
            >
              {t('title_3')}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16 flex items-center gap-5"
          >
            <div className="flex -space-x-3">
              <img
                src="https://res.cloudinary.com/dij8whzbd/image/upload/v1775540213/IMG_6455_lxxyuw.jpg"
                alt="User"
                className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <img
                src="https://res.cloudinary.com/dij8whzbd/image/upload/v1775540213/IMG_6455_lxxyuw.jpg"
                alt="User"
                className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <img
                src="https://res.cloudinary.com/dij8whzbd/image/upload/v1775540213/IMG_6455_lxxyuw.jpg"
                alt="User"
                className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
              />
            </div>
            <div>
              <div className="flex items-center gap-1 text-sm text-yellow-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="ml-1 font-bold text-gray-900">4.9</span>
              </div>
              <div className="mt-0.5 text-xs font-medium text-gray-500">{t('users_rating')}</div>
            </div>
          </motion.div>

          {/* Mobile-only: Subtitle + CTA (visible below stars on mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-10 lg:hidden"
          >
            <p className="mb-6 text-sm leading-relaxed font-medium text-gray-500">
              Planning your day should never take more than a few seconds. AI suggestions are always
              tailored for your unique workflow.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_25px_rgba(37,99,235,0.4)]"
            >
              {t('button')}
            </Link>
          </motion.div>

          {/* Bottom Left Card (Large Blue) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative mt-auto w-full max-w-[90%] pt-16"
          >
            {/* Floating 3D Coin/Icon Placeholder */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-0 left-1/2 z-20 hidden h-32 w-32 -translate-x-1/2 rotate-12 transform items-center justify-center rounded-full border-4 border-gray-50 bg-gradient-to-br from-gray-100 to-gray-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] lg:flex"
            >
              {/* Fake 3D inner edge */}
              <div className="absolute inset-2 rounded-full border-t-2 border-l-2 border-white/80 mix-blend-overlay"></div>
              <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-black/20 mix-blend-overlay"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4B5563"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </motion.div>

            {/* Dark Blue Base Card */}
            <div className="relative h-72 overflow-hidden rounded-t-[2.5rem] bg-[#0f2e73] px-8 pt-20 pb-0 shadow-2xl">
              {/* Light gradient accent */}
              <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-blue-500/40 to-transparent"></div>

              {/* Inner White Dashboard Card */}
              <div className="relative z-10 flex h-full flex-col gap-2 rounded-t-3xl bg-white p-5 shadow-inner">
                <div className="mb-1 flex items-center justify-between text-sm font-bold text-gray-500">
                  AI Generated Schedule
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-blue-600 uppercase">
                    Today
                  </span>
                </div>

                <div className="relative flex flex-grow flex-col gap-2.5 overflow-hidden">
                  {/* Vertical Line */}
                  <div className="absolute top-2 bottom-2 left-[47px] w-0.5 bg-gray-100"></div>

                  {/* Item 1 */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 shrink-0 text-right text-xs font-bold text-gray-400">
                      09:00
                    </div>
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <div className="flex flex-1 items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 shadow-sm">
                      <span className="text-xs font-bold text-blue-900">Deep Work: Coding</span>
                      <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-blue-500">
                        2h
                      </span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 shrink-0 text-right text-xs font-bold text-gray-400">
                      13:00
                    </div>
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-purple-500 ring-4 ring-white"></div>
                    <div className="flex flex-1 items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2">
                      <span className="text-xs font-bold text-gray-700">Team Sync</span>
                      <span className="rounded-md border border-gray-100 bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                        45m
                      </span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 shrink-0 text-right text-xs font-bold text-gray-400">
                      15:00
                    </div>
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300 ring-4 ring-white"></div>
                    <div className="flex flex-1 items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 opacity-60">
                      <span className="text-xs font-bold text-gray-600">Review PRs</span>
                      <span className="rounded-md border border-gray-100 bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                        1h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="flex h-full flex-col">
          {/* Top Row Cards */}
          <div className="grid h-[220px] grid-cols-2 gap-4 sm:h-[300px] sm:gap-6">
            {/* Phone Mockup Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative flex flex-col items-center justify-start overflow-hidden rounded-[2rem] border border-gray-200/50 bg-gray-100 p-6 shadow-sm"
            >
              <div className="absolute top-0 z-20 h-4 w-[85%] rounded-b-xl bg-black"></div>{' '}
              {/* Phone notch */}
              <div className="relative mt-4 flex h-[120%] w-[90%] flex-col rounded-3xl border-[6px] border-gray-900 bg-white p-4 shadow-xl">
                <div className="mt-1 mb-3 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Today&apos;s Focus
                </div>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-2.5">
                    <div className="h-3.5 w-3.5 shrink-0 rounded-full bg-blue-500"></div>
                    <div className="h-2 w-16 rounded bg-blue-600/70"></div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-gray-300"></div>
                    <div className="h-2 w-20 rounded bg-gray-400/50"></div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-gray-300"></div>
                    <div className="h-2 w-12 rounded bg-gray-400/50"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Square Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center justify-center rounded-[2rem] border border-gray-100 bg-white p-6 shadow-lg shadow-gray-100/50"
            >
              <div className="mx-auto mb-8 flex h-20 w-20 -rotate-3 transform items-center justify-center rounded-3xl bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.4)] transition-transform hover:rotate-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                  <polyline points="16 7 22 7 22 13" />
                </svg>
              </div>
              <div className="text-center">
                <div className="mb-1 text-4xl font-extrabold text-gray-900">+35%</div>
                <div className="text-sm font-medium text-gray-500">Efficiency Boost</div>
              </div>
            </motion.div>
          </div>

          {/* Middle Text & CTA (desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 hidden lg:block"
          >
            <p className="mb-8 max-w-[90%] text-sm leading-relaxed font-medium text-gray-500 md:text-base">
              Planning your day should never take more than a few seconds. AI suggestions are always
              tailored for your unique workflow.
            </p>

            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.3)] transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_12px_25px_rgba(37,99,235,0.4)]"
              >
                {t('button')}
              </Link>

              {/* Small Bar Chart Icon */}
              <div className="hidden items-end gap-1.5 pr-4 opacity-90 sm:flex">
                <div className="h-4 w-3 rounded-sm bg-[#0f2e73]"></div>
                <div className="h-6 w-3 rounded-sm bg-[#0f2e73]"></div>
                <div className="h-12 w-3 rounded-sm bg-[#0f2e73]"></div>
                <div className="h-8 w-3 rounded-sm bg-[#0f2e73]"></div>
              </div>
            </div>
          </motion.div>

          {/* Partners Logos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10 opacity-50 grayscale transition-all duration-500 hover:grayscale-0"
          >
            <div className="flex items-center gap-1.5 text-sm font-bold tracking-tight sm:text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Google
            </div>
            <div className="hidden items-center gap-1.5 text-sm font-bold tracking-tight sm:flex sm:text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0 .1-3.7s-1.2-.4-3.9 1.4a12.8 12.8 0 0 0-7 0C6.2 1.2 5 1.6 5 1.6a5.4 5.4 0 0 0 .1 3.7A5.4 5.4 0 0 0 3.6 9c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4" />
                <path d="M9 18c-4.5 1.5-5-2.5-7-3" />
              </svg>
              GitHub
            </div>
            <div className="hidden items-center gap-1.5 text-sm font-bold tracking-tight sm:flex sm:text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" />
                <path d="M9.5 9.5 15 15" />
                <path d="M15 9.5 9.5 15" />
              </svg>
              Linear
            </div>
            <div className="hidden items-center gap-1.5 font-sans text-sm font-extrabold tracking-tight sm:flex sm:text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              OpenAI
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
