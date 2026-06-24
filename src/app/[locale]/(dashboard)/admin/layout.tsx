'use client';

import { ReactNode } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Users, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'dashboard', href: '/admin', icon: ShieldCheck, exact: true },
  { key: 'users', href: '/admin/users', icon: Users, exact: false },
  { key: 'pending', href: '/admin/pending', icon: UserCheck, exact: false },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations('Admin');

  const isActive = (tab: (typeof tabs)[number]) =>
    tab.exact ? pathname === '/admin' : pathname.startsWith(tab.href);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{t('title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
        {tabs.map(({ key, href, icon: Icon }) => {
          const active = isActive({ key, href, icon: Icon, exact: key === 'dashboard' });
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all',
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
