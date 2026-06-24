'use client';

import { useEffect, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Loader2,
  ShieldCheck,
  ShieldX,
  Trash2,
  Pencil,
  ToggleLeft,
  Link2,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { EmptyState } from '@/components/shared/empty-state';

interface AuditLogEntry {
  id: string;
  action: string;
  details: Record<string, unknown> | null;
  createdAt: string;
  adminUser: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  targetUser: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const PAGE_SIZE = 20;

const actionConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  APPROVE: { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  REJECT: { icon: ShieldX, color: 'text-red-600', bg: 'bg-red-50' },
  DELETE: { icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
  UPDATE_ROLE: { icon: Pencil, color: 'text-blue-600', bg: 'bg-blue-50' },
  UPDATE_STATUS: { icon: ToggleLeft, color: 'text-amber-600', bg: 'bg-amber-50' },
  GENERATE_INVITE: { icon: Link2, color: 'text-purple-600', bg: 'bg-purple-50' },
  REVOKE_INVITE: { icon: Link2, color: 'text-red-600', bg: 'bg-red-50' },
};

export default function AdminAuditPage() {
  const t = useTranslations('Admin');
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams({
      skip: String(page * PAGE_SIZE),
      take: String(PAGE_SIZE),
    });

    if (fetchedRef.current) {
      setIsLoading(true);
    }
    api
      .get(`/api/admin/audit-logs?${params.toString()}`)
      .then((res) => {
        setLogs(res.data.data);
        setTotal(res.data.meta.total);
      })
      .catch(() => toast.error('Failed to load audit logs'))
      .finally(() => {
        setIsLoading(false);
        fetchedRef.current = true;
      });
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const formatAction = (action: string) =>
    action
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title={t('audit_empty')}
        description="Admin actions will appear here once they are performed."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                {t('audit_action')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                {t('audit_admin')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                {t('audit_target')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                {t('audit_details')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                {t('audit_time')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {logs.map((log) => {
              const config = actionConfig[log.action] || {
                icon: ShieldCheck,
                color: 'text-gray-600',
                bg: 'bg-gray-50',
              };
              const Icon = config.icon;

              return (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg ${config.bg}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {formatAction(log.action)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900">{log.adminUser.name}</p>
                      <p className="text-xs text-gray-500">{log.adminUser.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.targetUser ? (
                      <div>
                        <p className="text-sm text-gray-900">{log.targetUser.name}</p>
                        <p className="text-xs text-gray-500">{log.targetUser.email}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {log.details ? (
                      <div className="max-w-xs text-xs text-gray-500">
                        {Object.entries(log.details).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            <span className="text-gray-400">{key}:</span>{' '}
                            <span className="text-gray-600">{String(value)}</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {t('showing', {
              from: page * PAGE_SIZE + 1,
              to: Math.min((page + 1) * PAGE_SIZE, total),
              total,
            })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600">
              {page + 1} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
