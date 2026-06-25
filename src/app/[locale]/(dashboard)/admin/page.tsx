'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Users, UserCheck, UserX, Shield, Crown, User } from 'lucide-react';
import { api } from '@/lib/api';
import { EmptyState } from '@/components/shared/empty-state';

interface Stats {
  total: number;
  byStatus: { pending: number; active: number; rejected: number };
  byRole: { free: number; pro: number; admin: number };
}

const statCards = [
  { key: 'total', icon: Users, color: 'bg-blue-50 text-blue-600', getValue: (s: Stats) => s.total },
  {
    key: 'active',
    icon: UserCheck,
    color: 'bg-emerald-50 text-emerald-600',
    getValue: (s: Stats) => s.byStatus.active,
  },
  {
    key: 'pending',
    icon: UserX,
    color: 'bg-amber-50 text-amber-600',
    getValue: (s: Stats) => s.byStatus.pending,
  },
  {
    key: 'rejected',
    icon: UserX,
    color: 'bg-red-50 text-red-600',
    getValue: (s: Stats) => s.byStatus.rejected,
  },
];

const roleCards = [
  {
    key: 'free',
    icon: User,
    color: 'bg-gray-100 text-gray-600',
    getValue: (s: Stats) => s.byRole.free,
  },
  {
    key: 'pro',
    icon: Crown,
    color: 'bg-purple-50 text-purple-600',
    getValue: (s: Stats) => s.byRole.pro,
  },
  {
    key: 'admin',
    icon: Shield,
    color: 'bg-blue-50 text-blue-600',
    getValue: (s: Stats) => s.byRole.admin,
  },
];

export default function AdminDashboardPage() {
  const t = useTranslations('Admin');
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    api
      .get('/api/admin/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!stats) {
    return (
      <EmptyState
        icon={Users}
        title="Failed to load stats"
        description="Could not load dashboard statistics. Please try again."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Status cards */}
      <div>
        <h2 className="mb-4 text-sm font-medium text-gray-500">{t('stats_by_status')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map(({ key, icon: Icon, color, getValue }) => (
            <div key={key} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{getValue(stats)}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t(`stat_${key}`)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role cards */}
      <div>
        <h2 className="mb-4 text-sm font-medium text-gray-500">{t('stats_by_role')}</h2>
        <div className="grid grid-cols-3 gap-4">
          {roleCards.map(({ key, icon: Icon, color, getValue }) => (
            <div key={key} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
                <Icon className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{getValue(stats)}</p>
              <p className="mt-0.5 text-xs text-gray-500">{t(`role_${key}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
