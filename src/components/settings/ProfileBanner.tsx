'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Shield, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

export function ProfileBanner() {
  const tSettings = useTranslations('Settings');
  const { user } = useAuthStore();

  const handleEditProfile = () => {
    toast.info(tSettings('edit_profile_coming_soon'));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative overflow-hidden rounded-2xl px-6 py-5 shadow-lg"
      style={{
        background:
          'linear-gradient(135deg, oklch(0.62 0.22 255) 0%, oklch(0.55 0.24 265) 50%, oklch(0.50 0.22 278) 100%)',
      }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/8" />
      <div className="pointer-events-none absolute -right-4 -bottom-10 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        {/* Left: Avatar + Text */}
        <div className="flex items-center gap-4">
          <Image
            src={
              user?.avatarUrl ??
              'https://res.cloudinary.com/dij8whzbd/image/upload/v1780472089/profile_odszu1.jpg'
            }
            alt={user?.name ?? 'Avatar'}
            width={64}
            height={64}
            className="rounded-full shadow-md ring-2 ring-white/25"
          />
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">{user?.name}</h2>
            <p className="text-sm font-medium text-white/60">{user?.email}</p>
          </div>
        </div>

        {/* Right: Edit button + Role badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleEditProfile}
            className="flex cursor-not-allowed items-center gap-1 text-xs text-white/40"
          >
            <Pencil className="h-3 w-3" />
            {tSettings('edit_profile')}
          </button>
          <div className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/15 px-4 text-sm font-medium text-white/90 backdrop-blur-sm">
            <Shield className="h-4 w-4" />
            {tSettings('role_member')}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
