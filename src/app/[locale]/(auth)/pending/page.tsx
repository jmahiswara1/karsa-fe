'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Loader2, ShieldCheck, ShieldX, Hourglass } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PendingUser {
  name: string;
  email: string;
  avatarUrl: string;
}

function getPendingUser(): PendingUser | null {
  if (typeof document === 'undefined') return null;
  try {
    const cookies = document.cookie.split(';');
    const pendingCookie = cookies.find((c) => c.trim().startsWith('pending_user='));
    if (!pendingCookie) return null;
    const raw = pendingCookie.split('=').slice(1).join('=');
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

export default function PendingPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const initialUser = useMemo(() => getPendingUser(), []);
  const [status, setStatus] = useState<'checking' | 'pending' | 'approved' | 'rejected'>(
    'checking',
  );
  const [user] = useState<PendingUser | null>(initialUser);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${apiUrl}/api/auth/me`, {
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          if (data.data?.status === 'ACTIVE') {
            setStatus('approved');
            document.cookie = 'pending_user=; path=/; max-age=0';
            setTimeout(() => router.replace('/login'), 2000);
          } else if (data.data?.status === 'REJECTED') {
            setStatus('rejected');
          } else {
            setStatus('pending');
          }
        } else {
          setStatus('pending');
        }
      } catch {
        setStatus('pending');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex w-full flex-col items-center text-center">
      {status === 'checking' && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          </div>
          <p className="text-sm tracking-wide text-gray-400">{t('pending_waiting')}</p>
        </div>
      )}

      {status === 'pending' && (
        <div className="flex flex-col items-center">
          {/* User avatar */}
          <div className="relative mb-6">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'User'}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-blue-50"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 ring-4 ring-blue-50">
                <span className="text-2xl font-semibold text-blue-500">
                  {user?.name?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    '?'}
                </span>
              </div>
            )}
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm">
              <Hourglass className="h-3.5 w-3.5 text-blue-500" strokeWidth={2} />
            </div>
          </div>

          {/* User info */}
          {user && (
            <div className="mb-6">
              {user.name && <p className="text-sm font-medium text-gray-800">{user.name}</p>}
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
          )}

          <h1 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">
            {t('pending_title')}
          </h1>
          <p className="mb-8 max-w-xs text-sm leading-relaxed text-gray-400">
            {t('pending_subtitle')}
          </p>

          <div className="w-full max-w-xs rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
            <p className="text-xs text-gray-400">{t('pending_auto_redirect')}</p>
          </div>
        </div>
      )}

      {status === 'approved' && (
        <div className="flex flex-col items-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 shadow-sm">
            <ShieldCheck className="h-9 w-9 text-emerald-500" strokeWidth={1.5} />
          </div>
          <h1 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">Approved</h1>
          <p className="text-sm text-gray-400">Redirecting you to login...</p>
        </div>
      )}

      {status === 'rejected' && (
        <div className="flex flex-col items-center">
          <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
            <ShieldX className="h-9 w-9 text-gray-400" strokeWidth={1.5} />
          </div>
          <h1 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">
            {t('rejected_title')}
          </h1>
          <p className="mb-8 max-w-xs text-sm leading-relaxed text-gray-400">
            {t('rejected_subtitle')}
          </p>
          <Button
            variant="outline"
            className="rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50"
            onClick={() => router.replace('/login')}
          >
            {t('rejected_back')}
          </Button>
        </div>
      )}
    </div>
  );
}
