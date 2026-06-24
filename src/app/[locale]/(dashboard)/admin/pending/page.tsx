'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, UserCheck, UserX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { EmptyState } from '@/components/shared/empty-state';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export default function AdminPendingPage() {
  const t = useTranslations('Admin');
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    api
      .get('/api/admin/users/pending')
      .then((res) => setUsers(res.data.data))
      .catch(() => toast.error('Failed to load pending users'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleApprove = async (userId: string) => {
    setProcessingId(userId);
    try {
      await api.patch(`/api/admin/users/${userId}/approve`);
      toast.success(t('approve_success'));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      toast.error(t('approve_error'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (userId: string) => {
    setProcessingId(userId);
    try {
      await api.patch(`/api/admin/users/${userId}/reject`);
      toast.success(t('reject_success'));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      toast.error(t('reject_error'));
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={UserCheck}
        title={t('pending_empty')}
        description={t('pending_empty_desc')}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              {t('table_name')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              {t('table_email')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              {t('table_joined')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              {t('table_actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-blue-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{user.email}</td>
              <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => handleReject(user.id)}
                    disabled={processingId === user.id}
                  >
                    {processingId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserX className="mr-1.5 h-4 w-4" />
                    )}
                    {t('reject')}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApprove(user.id)}
                    disabled={processingId === user.id}
                  >
                    {processingId === user.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserCheck className="mr-1.5 h-4 w-4" />
                    )}
                    {t('approve')}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
