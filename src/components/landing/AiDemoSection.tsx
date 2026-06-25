'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export function AiDemoSection() {
  const t = useTranslations('AiDemo');
  const [text, setText] = useState('');
  const fullText = t('typing_text');
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let i = 0;

    // Delay before starting
    const startDelay = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setText(fullText.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => setShowResult(true), 600);
        }
      }, 50); // typing speed

      return () => clearInterval(typingInterval);
    }, 1500);

    return () => clearTimeout(startDelay);
  }, []); // Run once on mount. In a real app, this might trigger on scroll intersection.

  return (
    <section
      className="overflow-hidden bg-gradient-to-b from-white to-blue-50/30 px-6 py-24"
      id="ai-demo"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-3xl font-extrabold text-gray-900 md:text-5xl"
          >
            {t('title_1')} <br className="md:hidden" />
            <span className="text-blue-600">{t('title_2')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-xl text-lg text-gray-500"
          >
            {t('description')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2rem] border border-gray-100 bg-white p-4 shadow-2xl shadow-blue-900/10 md:p-8"
        >
          {/* Decorative background glow */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/20 blur-[80px]"></div>

          <div className="relative z-10 mx-auto max-w-2xl">
            {/* Fake Input Box */}
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-md">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full bg-blue-100 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
              <div className="relative min-h-[28px] flex-1 text-lg font-medium text-gray-800 md:text-xl">
                <span>{text}</span>
                {!showResult && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="ml-1 inline-block h-6 w-0.5 bg-blue-500 align-middle"
                  />
                )}
              </div>
              <div className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                {showResult ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m5 12 7-7 7 7" />
                    <path d="M12 19V5" />
                  </svg>
                ) : (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="opacity-50"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Generated Result Container */}
            <div className="flex min-h-[200px] items-start justify-center">
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-200/50"
                >
                  <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50 px-5 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-blue-600 uppercase">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                      {t('result_captured')}
                    </span>
                    <span className="text-xs font-medium text-gray-500">{t('result_inbox')}</span>
                  </div>
                  <div className="flex flex-col gap-4 p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full border-2 border-gray-300"></div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">{t('result_title')}</div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
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
                            {t('result_deadline')}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <line x1="12" x2="12" y1="8" y2="12" />
                              <line x1="12" x2="12.01" y1="16" y2="16" />
                            </svg>
                            {t('result_priority')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
