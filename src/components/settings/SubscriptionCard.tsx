'use client';

import { useTranslations, useLocale } from 'next-intl';
import { CreditCard, Crown, User as UserIcon, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/store/auth.store';

interface User {
  role?: UserRole;
  subscriptionExpiresAt?: string | null;
  createdAt?: string;
}

interface SubscriptionCardProps {
  user?: User | null;
}

const ROLE_CONFIG: Record<
  UserRole,
  { icon: LucideIcon; labelKey: 'role_free' | 'role_pro' | 'role_admin' }
> = {
  FREE: { icon: UserIcon, labelKey: 'role_free' },
  PRO: { icon: Crown, labelKey: 'role_pro' },
  ADMIN: { icon: ShieldCheck, labelKey: 'role_admin' },
};

function formatDate(dateStr?: string | null, locale?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
}

export function SubscriptionCard({ user }: SubscriptionCardProps) {
  const t = useTranslations('Settings');
  const locale = useLocale();

  const role: UserRole = user?.role ?? 'FREE';
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  const rows: { label: string; value: string; icon?: LucideIcon }[] = [
    { label: t('subscription_plan'), value: t(config.labelKey), icon: Icon },
    { label: t('subscription_price'), value: '-' },
    { label: t('subscription_cycle'), value: '-' },
    {
      label: t('subscription_next_billing'),
      value: formatDate(user?.subscriptionExpiresAt, locale),
    },
    { label: t('subscription_member_since'), value: formatDate(user?.createdAt, locale) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
    >
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <CreditCard className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{t('subscription_title')}</p>
              <p className="text-muted-foreground text-xs">{t('subscription_desc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-xs font-medium">{row.label}</span>
                <span
                  className={cn(
                    'text-sm font-semibold',
                    row.value === '-' && 'text-muted-foreground/60',
                  )}
                >
                  {row.icon ? (
                    <span className="flex items-center gap-1.5">
                      <row.icon className="h-3.5 w-3.5" />
                      {row.value}
                    </span>
                  ) : (
                    row.value
                  )}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
