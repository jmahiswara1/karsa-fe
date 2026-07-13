'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Users, LayoutDashboard, Heart, Shield, Sparkles } from 'lucide-react';

const features = [
  {
    key: 'card1',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'card2',
    icon: LayoutDashboard,
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    key: 'card3',
    icon: Heart,
    color: 'bg-rose-50 text-rose-600',
  },
  {
    key: 'card4',
    icon: Shield,
    color: 'bg-emerald-50 text-emerald-600',
  },
] as const;

function WorkspaceMockup() {
  return (
    <svg
      viewBox="0 0 480 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
    >
      {/* Browser Frame */}
      <rect
        x="0"
        y="0"
        width="480"
        height="320"
        rx="16"
        fill="#F9FAFB"
        stroke="#E5E7EB"
        strokeWidth="1.5"
      />

      {/* Top Bar */}
      <rect x="0" y="0" width="480" height="40" rx="16" fill="#F9FAFB" />
      <rect x="0" y="24" width="480" height="16" fill="#F9FAFB" />
      <circle cx="20" cy="16" r="5" fill="#FECACA" />
      <circle cx="36" cy="16" r="5" fill="#FDE68A" />
      <circle cx="52" cy="16" r="5" fill="#BBF7D0" />

      {/* Sidebar */}
      <rect x="0" y="40" width="140" height="280" fill="white" stroke="#E5E7EB" strokeWidth="1" />

      {/* Workspace Switcher */}
      <rect
        x="12"
        y="52"
        width="116"
        height="32"
        rx="8"
        fill="#EFF6FF"
        stroke="#BFDBFE"
        strokeWidth="1"
      />
      <rect x="20" y="60" width="16" height="16" rx="4" fill="#4B7BEC" />
      <rect x="42" y="62" width="60" height="8" rx="2" fill="#4B7BEC" opacity="0.7" />
      <rect x="42" y="74" width="40" height="6" rx="2" fill="#93C5FD" opacity="0.5" />

      {/* Nav Items */}
      <rect x="12" y="96" width="116" height="28" rx="6" fill="#4B7BEC" />
      <rect x="22" y="104" width="50" height="8" rx="2" fill="white" opacity="0.9" />

      <rect x="12" y="132" width="116" height="28" rx="6" fill="transparent" />
      <rect x="22" y="140" width="60" height="8" rx="2" fill="#9CA3AF" opacity="0.5" />

      <rect x="12" y="160" width="116" height="28" rx="6" fill="transparent" />
      <rect x="22" y="168" width="45" height="8" rx="2" fill="#9CA3AF" opacity="0.5" />

      <rect x="12" y="188" width="116" height="28" rx="6" fill="transparent" />
      <rect x="22" y="196" width="55" height="8" rx="2" fill="#9CA3AF" opacity="0.5" />

      {/* Members section */}
      <rect x="12" y="232" width="116" height="1" fill="#E5E7EB" />
      <rect x="22" y="248" width="40" height="8" rx="2" fill="#9CA3AF" opacity="0.4" />
      <circle cx="26" cy="272" r="10" fill="#4B7BEC" opacity="0.8" />
      <circle cx="46" cy="272" r="10" fill="#818CF8" opacity="0.8" />
      <circle cx="66" cy="272" r="10" fill="#34D399" opacity="0.8" />
      <circle cx="86" cy="272" r="10" fill="#F472B6" opacity="0.8" />
      <circle cx="106" cy="272" r="10" fill="#FBBF24" opacity="0.8" />

      {/* Main Content Area */}
      {/* Header */}
      <rect x="156" y="52" width="180" height="12" rx="3" fill="#1F2937" opacity="0.8" />
      <rect x="156" y="70" width="120" height="8" rx="2" fill="#9CA3AF" opacity="0.5" />

      {/* Filter Tabs */}
      <rect x="156" y="92" width="56" height="24" rx="6" fill="#4B7BEC" />
      <rect x="164" y="98" width="32" height="8" rx="2" fill="white" opacity="0.9" />
      <rect x="220" y="92" width="56" height="24" rx="6" fill="#F3F4F6" />
      <rect x="228" y="98" width="36" height="8" rx="2" fill="#6B7280" opacity="0.5" />
      <rect x="284" y="92" width="56" height="24" rx="6" fill="#F3F4F6" />
      <rect x="292" y="98" width="40" height="8" rx="2" fill="#6B7280" opacity="0.5" />

      {/* Project Card 1 */}
      <rect
        x="156"
        y="128"
        width="308"
        height="72"
        rx="12"
        fill="white"
        stroke="#E5E7EB"
        strokeWidth="1"
      />
      <rect x="168" y="140" width="120" height="10" rx="2" fill="#1F2937" opacity="0.8" />
      <rect x="168" y="156" width="180" height="8" rx="2" fill="#9CA3AF" opacity="0.4" />
      <rect x="168" y="172" width="60" height="20" rx="10" fill="#DBEAFE" />
      <rect x="176" y="177" width="44" height="8" rx="2" fill="#4B7BEC" opacity="0.7" />
      {/* Avatar stack */}
      <circle cx="420" cy="148" r="10" fill="#4B7BEC" opacity="0.8" />
      <circle cx="436" cy="148" r="10" fill="#818CF8" opacity="0.8" />
      <circle cx="444" cy="148" r="10" fill="transparent" stroke="#E5E7EB" strokeWidth="1" />
      <text x="444" y="152" textAnchor="middle" fontSize="8" fill="#6B7280">
        +3
      </text>

      {/* Project Card 2 */}
      <rect
        x="156"
        y="208"
        width="308"
        height="72"
        rx="12"
        fill="white"
        stroke="#E5E7EB"
        strokeWidth="1"
      />
      <rect x="168" y="220" width="100" height="10" rx="2" fill="#1F2937" opacity="0.8" />
      <rect x="168" y="236" width="160" height="8" rx="2" fill="#9CA3AF" opacity="0.4" />
      <rect x="168" y="252" width="50" height="20" rx="10" fill="#D1FAE5" />
      <rect x="176" y="257" width="34" height="8" rx="2" fill="#059669" opacity="0.7" />
      <circle cx="420" cy="228" r="10" fill="#34D399" opacity="0.8" />
      <circle cx="436" cy="228" r="10" fill="#F472B6" opacity="0.8" />

      {/* Notification badge */}
      <rect x="390" y="52" width="74" height="28" rx="14" fill="#4B7BEC" opacity="0.1" />
      <rect x="398" y="58" width="12" height="12" rx="6" fill="#4B7BEC" />
      <rect x="414" y="60" width="42" height="8" rx="2" fill="#4B7BEC" opacity="0.6" />
    </svg>
  );
}

export function TeamWorkspaceSection() {
  const t = useTranslations('TeamWorkspace');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-24" id="teams">
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span className="text-xs font-semibold tracking-wide text-blue-700 uppercase">
            {t('badge')}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.05 }}
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
          className="mx-auto max-w-2xl text-lg text-gray-500"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      {/* Feature Cards */}
      <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feat.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900">{t(`${feat.key}_title`)}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{t(`${feat.key}_desc`)}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Mockup + Notify */}
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg shadow-gray-100/50">
            <WorkspaceMockup />
          </div>
        </motion.div>

        {/* Notify Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start"
        >
          <h3 className="mb-3 text-2xl font-extrabold text-gray-900 md:text-3xl">
            {t('notify_title')}
          </h3>

          {submitted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-4">
              <p className="text-sm font-medium text-emerald-700">
                Terima kasih! Kami akan menghubungi Anda saat fitur tim tersedia.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3">
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('notify_placeholder')}
                  required
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-colors outline-none placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
                >
                  {t('notify_button')}
                </button>
              </div>
              <p className="text-xs text-gray-400">{t('notify_note')}</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
