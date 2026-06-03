'use client';

import { Menu, Bell, Search, ChevronDown, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuthStore } from '@/store/auth.store';
import Image from 'next/image';

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

function useDashboardTitle(
  tPages: ReturnType<typeof useTranslations<'Pages'>>,
  tSidebar: ReturnType<typeof useTranslations<'Sidebar'>>,
): string {
  const pathname = usePathname();
  if (pathname === '/dashboard') return tSidebar('dashboard');
  if (pathname.startsWith('/tasks')) return tPages('tasks_title');
  if (pathname.startsWith('/projects')) return tPages('projects_title');
  if (pathname.startsWith('/notes')) return tPages('notes_title');
  if (pathname.startsWith('/planner')) return tPages('planner_title');
  if (pathname.startsWith('/assistant')) return tPages('assistant_title');
  if (pathname.startsWith('/settings')) return tPages('settings_title');
  return 'Karsa';
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const tPages = useTranslations('Pages');
  const tSidebar = useTranslations('Sidebar');
  const tDash = useTranslations('Dashboard');
  const { user } = useAuthStore();
  const title = useDashboardTitle(tPages, tSidebar);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const ThemeIcon = !mounted
    ? Monitor
    : theme === 'light'
      ? Sun
      : theme === 'dark'
        ? Moon
        : Monitor;

  return (
    <header
      className="border-border/50 bg-card sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b px-4 md:px-6"
      style={{ boxShadow: '0 1px 8px 0 rgba(75, 123, 236, 0.06)' }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-9 w-9 items-center justify-center rounded-xl transition-colors md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search bar — hidden on mobile */}
      <div className="hidden flex-1 md:flex md:max-w-sm">
        <div className="relative w-full">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search here"
            className="border-border bg-muted/40 text-foreground placeholder:text-muted-foreground/70 focus:border-primary/40 focus:bg-card focus:ring-primary/15 h-9 w-full rounded-xl border pr-4 pl-9 text-sm transition-all outline-none focus:ring-2"
          />
        </div>
      </div>

      {/* Mobile page title */}
      <h2 className="text-foreground flex-1 text-base font-semibold md:hidden">{title}</h2>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <LanguageSwitcher />

        {/* Theme toggle */}
        <button
          onClick={cycleTheme}
          className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
          title={mounted ? (theme ?? 'system') : 'system'}
        >
          <ThemeIcon style={{ width: '1.125rem', height: '1.125rem' }} />
        </button>

        {/* Notification bell */}
        <button
          className="text-muted-foreground hover:bg-muted hover:text-foreground relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
          aria-label={tDash('notification_title')}
          title={tDash('notification_title')}
        >
          <Bell className="h-4.5 w-4.5" style={{ width: '1.125rem', height: '1.125rem' }} />
          <span className="bg-primary ring-card absolute top-2 right-2 h-2 w-2 rounded-full ring-2" />
        </button>

        {/* User info — desktop */}
        {user && (
          <div className="hover:bg-muted hidden cursor-pointer items-center gap-3 rounded-xl px-2 py-1 transition-colors md:flex">
            <Image
              src={
                user.avatarUrl ??
                'https://res.cloudinary.com/dij8whzbd/image/upload/v1780472089/profile_odszu1.jpg'
              }
              alt={user.name ?? 'User'}
              width={36}
              height={36}
              className="ring-border rounded-full ring-2"
            />
            <div className="flex flex-col">
              <span className="text-foreground text-sm leading-none font-semibold">
                {user.name ?? user.email}
              </span>
              <span className="text-muted-foreground mt-1.5 text-xs leading-none">Admin</span>
            </div>
            <ChevronDown className="text-primary ml-1 h-4 w-4" />
          </div>
        )}
      </div>
    </header>
  );
}
