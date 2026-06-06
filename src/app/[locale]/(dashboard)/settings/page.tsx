'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRouter, usePathname } from '@/i18n/routing';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { useAuthStore } from '@/store/auth.store';
import { usePreferencesQuery, useUpdatePreferences } from '@/hooks/use-preferences';
import { toast } from 'sonner';
import Image from 'next/image';
import { User, Globe, SunMoon } from 'lucide-react';

export default function SettingsPage() {
  const tPages = useTranslations('Pages');
  const tSettings = useTranslations('Settings');
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const { data: preferences, isLoading } = usePreferencesQuery();
  const updatePreferences = useUpdatePreferences();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleLanguageChange = (value: string | null) => {
    if (!value) return;
    updatePreferences.mutate(
      { language: value },
      {
        onSuccess: () => {
          router.replace(pathname, { locale: value as 'en' | 'id' });
          toast.success(tSettings('save_success'));
        },
        onError: () => toast.error(tSettings('save_error')),
      },
    );
  };

  const handleThemeChange = (value: string | null) => {
    if (!value) return;
    setTheme(value);
    updatePreferences.mutate(
      { theme: value },
      {
        onSuccess: () => toast.success(tSettings('save_success')),
        onError: () => toast.error(tSettings('save_error')),
      },
    );
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <PageHeader title={tPages('settings_title')} description={tPages('settings_desc')} />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title={tPages('settings_title')} description={tPages('settings_desc')} />

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {tSettings('profile_title')}
          </CardTitle>
          <CardDescription>{tSettings('profile_desc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Image
                src={
                  user.avatarUrl ??
                  'https://res.cloudinary.com/dij8whzbd/image/upload/v1780472089/profile_odszu1.jpg'
                }
                alt={user.name ?? ''}
                width={56}
                height={56}
                className="ring-border rounded-full ring-2"
              />
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">{tSettings('field_name')}</Label>
                <p className="text-sm font-medium">{user.name}</p>
                <Label className="text-muted-foreground text-xs">{tSettings('field_email')}</Label>
                <p className="text-muted-foreground text-sm">{user.email}</p>
              </div>
            </div>
          ) : (
            <Skeleton className="h-16 w-full" />
          )}
        </CardContent>
      </Card>

      {/* Language Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {tSettings('language_title')}
          </CardTitle>
          <CardDescription>{tSettings('language_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <Select value={preferences?.language ?? 'id'} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">{tSettings('language_id')}</SelectItem>
                <SelectItem value="en">{tSettings('language_en')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Theme Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SunMoon className="h-5 w-5" />
            {tSettings('theme_title')}
          </CardTitle>
          <CardDescription>{tSettings('theme_desc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <Select value={theme ?? 'system'} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{tSettings('theme_light')}</SelectItem>
                <SelectItem value="dark">{tSettings('theme_dark')}</SelectItem>
                <SelectItem value="system">{tSettings('theme_system')}</SelectItem>
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
