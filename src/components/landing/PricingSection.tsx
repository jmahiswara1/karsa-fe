'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Check, Crown, Zap } from 'lucide-react';

const freeFeatures = ['feature_unlimited_tasks', 'feature_notes', 'feature_ai_limited'] as const;

const proFeatures = [
  'feature_unlimited_tasks',
  'feature_notes',
  'feature_ai_unlimited',
  'feature_calendar_sync',
  'feature_export',
  'feature_priority_support',
  'feature_collabs',
] as const;

export function PricingSection() {
  const t = useTranslations('Pricing');

  return (
    <section className="mx-auto max-w-5xl px-6 py-24" id="pricing">
      <div className="mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-6 text-3xl font-extrabold text-gray-900 md:text-5xl"
        >
          {t('title_1')}
          <span className="text-blue-600">{t('title_2')}</span>
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-200 bg-white p-8"
        >
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">{t('free_name')}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">{t('free_price')}</span>
              <span className="text-gray-500">{t('free_period')}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{t('free_desc')}</p>
          </div>

          <ul className="mb-8 space-y-3">
            {freeFeatures.map((key) => (
              <li key={key} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span className="text-sm text-gray-600">{t(key)}</span>
              </li>
            ))}
          </ul>

          <button className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            {t('get_started')}
          </button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.2 }}
          className="relative rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-lg shadow-blue-600/10"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
              <Crown className="h-3 w-3" />
              {t('most_popular')}
            </span>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Crown className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">{t('pro_name')}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-gray-900">{t('pro_price')}</span>
              <span className="text-gray-500">{t('pro_period')}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">{t('pro_desc')}</p>
          </div>

          <ul className="mb-8 space-y-3">
            {proFeatures.map((key) => (
              <li key={key} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <span className="text-sm text-gray-600">{t(key)}</span>
              </li>
            ))}
          </ul>

          <button
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white opacity-70 transition-colors"
          >
            {t('coming_soon')}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
