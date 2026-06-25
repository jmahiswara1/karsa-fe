'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface EditUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  subscriptionExpiresAt: string | null;
}

interface EditUserDialogProps {
  user: EditUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onSaved }: EditUserDialogProps) {
  const t = useTranslations('Admin');
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const [subscriptionExpiresAt, setSubscriptionExpiresAt] = useState(
    user.subscriptionExpiresAt ? user.subscriptionExpiresAt.split('T')[0] : '',
  );
  const [isSaving, setIsSaving] = useState(false);
  const prevUserId = useRef(user.id);

  useEffect(() => {
    if (prevUserId.current !== user.id) {
      prevUserId.current = user.id;
      setRole(user.role);
      setStatus(user.status);
      setSubscriptionExpiresAt(
        user.subscriptionExpiresAt ? user.subscriptionExpiresAt.split('T')[0] : '',
      );
    }
  }, [user.id, user.role, user.status, user.subscriptionExpiresAt]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (role !== user.role) {
        await api.patch(`/api/admin/users/${user.id}/role`, {
          role,
          subscriptionExpiresAt:
            role === 'PRO' && subscriptionExpiresAt ? subscriptionExpiresAt : undefined,
        });
      }

      if (status !== user.status) {
        await api.patch(`/api/admin/users/${user.id}/status`, { status });
      }

      if (role === 'PRO' && subscriptionExpiresAt && role === user.role) {
        await api.patch(`/api/admin/users/${user.id}/role`, {
          role,
          subscriptionExpiresAt,
        });
      }

      toast.success(t('edit_success'));
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error(t('edit_error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('edit_title')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* User info */}
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>{t('field_role')}</Label>
            <Select value={role} onValueChange={(v) => setRole(v ?? '')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FREE">FREE</SelectItem>
                <SelectItem value="PRO">PRO</SelectItem>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t('field_status')}</Label>
            <Select value={status} onValueChange={(v) => setStatus(v ?? '')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="REJECTED">REJECTED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription expiry (only for PRO) */}
          {role === 'PRO' && (
            <div className="space-y-2">
              <Label>{t('field_subscription_expires')}</Label>
              <Input
                type="date"
                value={subscriptionExpiresAt}
                onChange={(e) => setSubscriptionExpiresAt(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
