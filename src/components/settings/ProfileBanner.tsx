'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Crown, User as UserIcon, ShieldCheck, Pencil } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore, type UserRole } from '@/store/auth.store';
import { toast } from 'sonner';

type RoleConfig = {
  icon: LucideIcon;
  labelKey: 'role_free' | 'role_pro' | 'role_admin';
  className: string;
};

const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  FREE: {
    icon: UserIcon,
    labelKey: 'role_free',
    className: 'border border-white/10 bg-white/10 text-white/80 backdrop-blur-sm',
  },
  PRO: {
    icon: Crown,
    labelKey: 'role_pro',
    className:
      'border border-rose-300/30 bg-gradient-to-r from-rose-400/80 to-pink-500/80 text-white shadow-[0_0_18px_-2px_rgba(251,113,133,0.5)] backdrop-blur-sm',
  },
  ADMIN: {
    icon: ShieldCheck,
    labelKey: 'role_admin',
    className:
      'border border-yellow-300/30 bg-gradient-to-r from-yellow-400/80 to-amber-500/80 text-white shadow-[0_0_18px_-2px_rgba(250,204,21,0.5)] backdrop-blur-sm',
  },
};

function RoleBadge({ role }: { role?: UserRole }) {
  const tSettings = useTranslations('Settings');
  const effectiveRole: UserRole = role ?? 'FREE';
  const config = ROLE_CONFIG[effectiveRole];
  const Icon = config.icon;
  return (
    <div
      className={`flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium ${config.className}`}
    >
      <Icon className="h-4 w-4" />
      {tSettings(config.labelKey)}
    </div>
  );
}

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
          <RoleBadge role={user?.role} />
        </div>
      </div>
    </motion.div>
  );
}
