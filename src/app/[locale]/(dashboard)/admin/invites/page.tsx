'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, Link2, Plus, Copy, Trash2, Check, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { EmptyState } from '@/components/shared/empty-state';

interface Invite {
  id: string;
  code: string;
  email: string | null;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
  creator: { id: string; name: string; email: string };
  user: { id: string; name: string; email: string } | null;
}

export default function AdminInvitesPage() {
  const t = useTranslations('Admin');
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const [generateEmail, setGenerateEmail] = useState('');
  const [generateDays, setGenerateDays] = useState(7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatedInvite, setGeneratedInvite] = useState<Invite | null>(null);
  const fetchedRef = useRef(false);

  const fetchInvites = useCallback(async () => {
    if (fetchedRef.current) setIsLoading(true);
    try {
      const res = await api.get('/api/admin/invites');
      setInvites(res.data.data);
    } catch {
      toast.error('Failed to load invites');
    } finally {
      setIsLoading(false);
      fetchedRef.current = true;
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchInvites();
  }, [fetchInvites]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post('/api/admin/invites', {
        email: generateEmail || undefined,
        expiresInDays: generateDays,
      });
      setGeneratedInvite(res.data.data);
      toast.success(t('invite_generated'));
      fetchInvites();
    } catch {
      toast.error(t('invite_generate_error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (code: string, id: string) => {
    const url = `${window.location.origin}/login?invite=${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success(t('invite_copied'));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = async (id: string) => {
    try {
      await api.delete(`/api/admin/invites/${id}`);
      toast.success(t('invite_revoked'));
      setInvites((prev) => prev.filter((i) => i.id !== id));
    } catch {
      toast.error(t('invite_revoke_error'));
    }
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div />
        <Button onClick={() => setShowGenerate(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('invite_generate')}
        </Button>
      </div>

      {invites.length === 0 ? (
        <EmptyState
          icon={Link2}
          title={t('invite_empty')}
          description={t('invite_empty_desc')}
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGenerate(true)}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              {t('invite_generate')}
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {t('invite_code')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {t('invite_email')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {t('invite_status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {t('invite_used_by')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {t('invite_expires')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  {t('table_actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {invites.map((invite) => (
                <tr key={invite.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-800">
                        {invite.code}
                      </code>
                      <button
                        onClick={() => handleCopy(invite.code, invite.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {copiedId === invite.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {invite.email || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        invite.isUsed
                          ? 'bg-gray-100 text-gray-500'
                          : isExpired(invite.expiresAt)
                            ? 'bg-red-50 text-red-700'
                            : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {invite.isUsed
                        ? t('invite_used')
                        : isExpired(invite.expiresAt)
                          ? t('invite_expired')
                          : t('invite_active')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    {invite.user ? (
                      <div>
                        <p className="text-gray-900">{invite.user.name}</p>
                        <p className="text-xs text-gray-400">{invite.user.email}</p>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-gray-400" />
                      {new Date(invite.expiresAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopy(invite.code, invite.id)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      {!invite.isUsed && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleRevoke(invite.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Generate Dialog */}
      <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('invite_generate_title')}</DialogTitle>
          </DialogHeader>

          {generatedInvite ? (
            <div className="space-y-4 py-2">
              <div className="rounded-lg bg-emerald-50 p-4">
                <p className="text-sm font-medium text-emerald-800">
                  {t('invite_generated_success')}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-sm text-gray-800">
                    {window.location.origin}/login?invite={generatedInvite.code}
                  </code>
                  <Button
                    size="sm"
                    onClick={() => handleCopy(generatedInvite.code, generatedInvite.id)}
                  >
                    {copiedId === generatedInvite.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setGeneratedInvite(null);
                    setShowGenerate(false);
                    setGenerateEmail('');
                  }}
                >
                  {t('close')}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>{t('invite_email_optional')}</Label>
                  <Input
                    type="email"
                    placeholder={t('invite_email_placeholder')}
                    value={generateEmail}
                    onChange={(e) => setGenerateEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-400">{t('invite_email_hint')}</p>
                </div>
                <div className="space-y-2">
                  <Label>{t('invite_expires_in')}</Label>
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={generateDays}
                    onChange={(e) => setGenerateDays(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowGenerate(false)}>
                  {t('cancel')}
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('invite_generate_confirm')}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
