'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
  Loader2,
  FileText,
  FolderOpen,
  StickyNote,
  LogIn,
  Bot,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { EmptyState } from '@/components/shared/empty-state';

interface ActivityUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

interface ActivityEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: ActivityUser;
}

const PAGE_SIZE = 20;

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  UPDATE: 'bg-blue-50 text-blue-700 border-blue-200',
  DELETE: 'bg-red-50 text-red-700 border-red-200',
  LOGIN: 'bg-purple-50 text-purple-700 border-purple-200',
  AI_CREATE: 'bg-amber-50 text-amber-700 border-amber-200',
};

function getActivityIcon(entityType: string) {
  switch (entityType) {
    case 'Task':
      return FileText;
    case 'Project':
      return FolderOpen;
    case 'Note':
      return StickyNote;
    case 'User':
      return LogIn;
    default:
      return Bot;
  }
}

export default function AdminActivityPage() {
  const t = useTranslations('Admin');
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const fetchedRef = useRef(false);

  const fetchActivities = useCallback(async () => {
    if (fetchedRef.current) setIsLoading(true);
    const params = new URLSearchParams({
      skip: String(page * PAGE_SIZE),
      take: String(PAGE_SIZE),
    });
    if (actionFilter && actionFilter !== '__all__') params.set('action', actionFilter);
    if (entityFilter && entityFilter !== '__all__') params.set('entityType', entityFilter);

    try {
      const res = await api.get(`/api/admin/activities?${params.toString()}`);
      setActivities(res.data.data);
      setTotal(res.data.meta.total);
    } catch {
      toast.error('Failed to load activities');
    } finally {
      setIsLoading(false);
      fetchedRef.current = true;
    }
  }, [page, actionFilter, entityFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchActivities();
  }, [fetchActivities]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const from = page * PAGE_SIZE + 1;
  const to = Math.min((page + 1) * PAGE_SIZE, total);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={actionFilter}
          onValueChange={(v) => {
            setActionFilter(v ?? '');
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('activity_filter_action')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('activity_filter_all')}</SelectItem>
            <SelectItem value="CREATE">CREATE</SelectItem>
            <SelectItem value="UPDATE">UPDATE</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="LOGIN">LOGIN</SelectItem>
            <SelectItem value="AI_CREATE">AI_CREATE</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={entityFilter}
          onValueChange={(v) => {
            setEntityFilter(v ?? '');
            setPage(0);
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t('activity_filter_entity')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t('activity_filter_all')}</SelectItem>
            <SelectItem value="Task">Task</SelectItem>
            <SelectItem value="Project">Project</SelectItem>
            <SelectItem value="Note">Note</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-100 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : activities.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={t('activity_empty')}
            description={t('activity_empty_desc')}
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  {t('activity_col_user')}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  {t('activity_col_action')}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  {t('activity_col_entity')}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  {t('activity_col_details')}
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-500">
                  {t('activity_col_time')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.entityType);
                const details = activity.details;
                const title = details?.title as string | undefined;
                return (
                  <tr key={activity.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                          {activity.user.avatarUrl ? (
                            <img
                              src={activity.user.avatarUrl}
                              alt={activity.user.name}
                              className="h-7 w-7 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-600">
                              {activity.user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-800">
                            {activity.user.name}
                          </p>
                          <p className="truncate text-xs text-gray-400">{activity.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${ACTION_COLORS[activity.action] || 'border-gray-200 bg-gray-50 text-gray-700'}`}
                      >
                        {activity.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Icon className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700">{activity.entityType}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="max-w-[200px] truncate text-sm text-gray-600">{title || '—'}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{t('showing', { from, to, total })}</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs text-gray-600">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
