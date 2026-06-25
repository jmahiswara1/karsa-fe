'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import {
  Loader2,
  Mail,
  Calendar,
  Shield,
  Clock,
  ExternalLink,
  Pencil,
  Trash2,
  FileText,
  FolderOpen,
  StickyNote,
  LogIn,
  Bot,
  ChevronDown,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { EditUserDialog } from './EditUserDialog';
import { DeleteUserDialog } from './DeleteUserDialog';

interface UserDetail {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  googleId: string | null;
  role: string;
  status: string;
  subscriptionExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    projects: number;
    tasks: number;
    notes: number;
    conversations: number;
    activityLogs: number;
  };
}

interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown> | null;
  createdAt: string;
}

interface UserDetailDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

const ENTITY_ICONS: Record<string, React.ElementType> = {
  Task: FileText,
  Project: FolderOpen,
  Note: StickyNote,
  User: Shield,
};

function getActivityIcon(action: string, entityType: string): React.ElementType {
  if (action === 'LOGIN') return LogIn;
  if (action === 'AI_CREATE') return Bot;
  return ENTITY_ICONS[entityType] || FileText;
}

export function UserDetailDialog({ userId, open, onOpenChange, onRefresh }: UserDetailDialogProps) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  useEffect(() => {
    if (!userId || !open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    api
      .get(`/api/admin/users/${userId}`)
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [userId, open]);

  const fetchActivities = useCallback(
    async (take: number) => {
      if (!userId) return;
      setIsLoadingActivities(true);
      try {
        const res = await api.get(`/api/admin/users/${userId}/activities?take=${take}`);
        setActivities(res.data.data);
      } catch {
        setActivities([]);
      } finally {
        setIsLoadingActivities(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    if (!userId || !open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchActivities(3);
  }, [userId, open, fetchActivities]);

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
  };

  const roleColors: Record<string, string> = {
    FREE: 'bg-gray-100 text-gray-700 border-gray-200',
    PRO: 'bg-purple-50 text-purple-700 border-purple-200',
    ADMIN: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  if (!open) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('detail_title')}</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : !user ? (
            <p className="py-8 text-center text-sm text-gray-500">{t('detail_not_found')}</p>
          ) : (
            <div className="space-y-5">
              {/* Header: avatar + name + badges */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-semibold text-blue-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold text-gray-900">{user.name}</h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleColors[user.role] || roleColors.FREE}`}
                    >
                      {user.role}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[user.status] || statusColors.PENDING}`}
                    >
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoRow icon={Mail} label={t('detail_email')} value={user.email} />
                <InfoRow
                  icon={Shield}
                  label={t('detail_google_id')}
                  value={user.googleId || '—'}
                  mono
                />
                <InfoRow
                  icon={Calendar}
                  label={t('detail_joined')}
                  value={new Date(user.createdAt).toLocaleString()}
                />
                <InfoRow
                  icon={Clock}
                  label={t('detail_updated')}
                  value={new Date(user.updatedAt).toLocaleString()}
                />
                {user.subscriptionExpiresAt && (
                  <InfoRow
                    icon={Calendar}
                    label={t('detail_subscription_expires')}
                    value={new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                  />
                )}
              </div>

              {/* Stats */}
              {user._count && (
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <p className="mb-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
                    {t('detail_activity')}
                  </p>
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
                    <StatItem label={t('detail_projects')} value={user._count.projects} />
                    <StatItem label={t('detail_tasks')} value={user._count.tasks} />
                    <StatItem label={t('detail_notes')} value={user._count.notes} />
                    <StatItem label={t('detail_chats')} value={user._count.conversations} />
                    <StatItem label={t('detail_logs')} value={user._count.activityLogs} />
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                <p className="mb-3 text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {t('detail_recent_activity')}
                </p>
                {isLoadingActivities ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : activities.length === 0 ? (
                  <p className="py-4 text-center text-xs text-gray-400">
                    {t('detail_no_activity')}
                  </p>
                ) : (
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {activities.map((activity) => {
                      const Icon = getActivityIcon(activity.action, activity.entityType);
                      const details = activity.details as Record<string, unknown> | null;
                      const title = details?.title as string | undefined;
                      return (
                        <div
                          key={activity.id}
                          className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 hover:bg-gray-100/50"
                        >
                          <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs text-gray-700">
                              <span className="font-medium">{activity.action}</span>{' '}
                              <span className="text-gray-500">{activity.entityType}</span>
                              {title && <span className="text-gray-500"> &middot; {title}</span>}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {new Date(activity.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {(user._count?.activityLogs ?? 0) > 3 && (
                      <button
                        onClick={() => {
                          onOpenChange(false);
                          router.push(`/admin/users/${userId}/activity`);
                        }}
                        className="flex w-full items-center justify-center gap-1 pt-2 text-xs text-gray-500 hover:text-gray-700"
                      >
                        <ChevronDown className="h-3 w-3" />
                        {t('detail_view_all_activity')}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 border-t border-gray-100 pt-4">
                {user.avatarUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => window.open(user.avatarUrl!, '_blank')}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t('detail_view_avatar')}
                  </Button>
                )}
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setShowEdit(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t('edit')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-red-500 hover:text-red-600"
                  onClick={() => setShowDelete(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {t('delete')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Nested dialogs */}
      {user && showEdit && (
        <EditUserDialog
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            subscriptionExpiresAt: user.subscriptionExpiresAt,
          }}
          open={showEdit}
          onOpenChange={setShowEdit}
          onSaved={() => {
            onRefresh?.();
            // Re-fetch detail
            if (userId) {
              api.get(`/api/admin/users/${userId}`).then((res) => setUser(res.data.data));
            }
          }}
        />
      )}
      {user && showDelete && (
        <DeleteUserDialog
          userId={user.id}
          userName={user.name}
          open={showDelete}
          onOpenChange={setShowDelete}
          onDeleted={() => {
            onRefresh?.();
            onOpenChange(false);
          }}
        />
      )}
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400">{label}</p>
        <p className={`truncate text-sm text-gray-800 ${mono ? 'font-mono text-xs' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-lg font-semibold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500">{label}</p>
    </div>
  );
}
