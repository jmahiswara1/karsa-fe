'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface User {
  name?: string;
  email: string;
  avatarUrl?: string;
}

interface PageBannerProps {
  title?: string;
  user?: User | null;
  subtitle?: string;
  rightSlot?: ReactNode;
  bottomSlot?: ReactNode;
}

function getFirstName(user?: User | null): string {
  if (user?.name) {
    return user.name.split(' ')[0];
  }
  if (user?.email) {
    const local = user.email.split('@')[0];
    const token = local.split(/[._-]/)[0];
    return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
  }
  return 'there';
}

function getGreetingKey(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return 'greeting_morning';
  if (h >= 12 && h < 17) return 'greeting_afternoon';
  if (h >= 17 && h < 21) return 'greeting_evening';
  return 'greeting_night';
}

export function PageBanner({ title, user, subtitle, rightSlot, bottomSlot }: PageBannerProps) {
  const t = useTranslations('Dashboard');
  const greetingKey = getGreetingKey();
  const firstName = getFirstName(user);

  return (
    <div className="space-y-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className={`relative overflow-hidden px-6 py-5 shadow-lg ${bottomSlot ? 'rounded-t-2xl' : 'rounded-2xl'}`}
        style={{
          background:
            'linear-gradient(135deg, oklch(0.62 0.22 255) 0%, oklch(0.55 0.24 265) 50%, oklch(0.50 0.22 278) 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/8" />
        <div className="pointer-events-none absolute -right-4 -bottom-10 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex items-center justify-between">
          {/* Left: Content */}
          <div className="flex items-center gap-3.5">
            {user && (
              <Image
                src={
                  user.avatarUrl ??
                  'https://res.cloudinary.com/dij8whzbd/image/upload/v1780472089/profile_odszu1.jpg'
                }
                alt={user.name ?? 'Avatar'}
                width={44}
                height={44}
                className="rounded-full shadow-md ring-2 ring-white/25"
              />
            )}
            <div>
              {user ? (
                <>
                  {title && (
                    <p className="text-[11px] font-semibold tracking-widest text-white/45 uppercase">
                      {title}
                    </p>
                  )}
                  <h1 className="text-lg font-bold tracking-tight text-white">
                    {t(greetingKey)}, {firstName}.
                  </h1>
                </>
              ) : (
                title && <h1 className="text-lg font-bold tracking-tight text-white">{title}</h1>
              )}
              {subtitle && <p className="text-sm font-medium text-white/60">{subtitle}</p>}
            </div>
          </div>

          {/* Right slot */}
          {rightSlot && <div>{rightSlot}</div>}
        </div>
      </motion.div>

      {/* Bottom slot */}
      {bottomSlot && (
        <div
          className="overflow-hidden rounded-b-2xl shadow-lg"
          style={{
            background:
              'linear-gradient(135deg, oklch(0.64 0.19 255) 0%, oklch(0.58 0.20 265) 50%, oklch(0.54 0.18 278) 100%)',
          }}
        >
          {bottomSlot}
        </div>
      )}
    </div>
  );
}
