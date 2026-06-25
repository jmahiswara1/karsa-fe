'use client';

import { ReactNode } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Users, UserCheck, Activity, Link2, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageIntro } from '@/components/shared/page-header';

const tabs = [
  { key: 'dashboard', href: '/admin', icon: ShieldCheck, exact: true },
  { key: 'users', href: '/admin/users', icon: Users, exact: false },
  { key: 'pending', href: '/admin/pending', icon: UserCheck, exact: false },
  { key: 'audit', href: '/admin/audit', icon: Activity, exact: false },
  { key: 'activity', href: '/admin/activity', icon: History, exact: false },
  { key: 'invites', href: '/admin/invites', icon: Link2, exact: false },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('Admin');

  const isActive = (tab: (typeof tabs)[number]) =>
    tab.exact ? pathname === '/admin' : pathname.startsWith(tab.href);

  return (
    <div className="space-y-6 pb-8">
      <PageIntro title={t('title')} subtitle={t('subtitle')} />

      <div className="inline-flex gap-1 rounded-xl border border-gray-100 bg-gray-50/80 p-1">
        {tabs.map(({ key, href, icon: Icon }) => {
          const active = isActive({
            key,
            href,
            icon: Icon,
            exact: key === 'dashboard',
          });
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all',
                active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              <Icon className="h-4 w-4" />
              {t(`tab_${key}`)}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
