'use client';

import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth.store';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  FileText,
  ListChecks,
  CalendarRange,
  Sparkles,
  Settings,
  X,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'tasks', href: '/tasks', icon: CheckSquare },
  { key: 'projects', href: '/projects', icon: FolderOpen },
  { key: 'notes', href: '/notes', icon: FileText },
  { key: 'planner', href: '/planner', icon: ListChecks },
  { key: 'calendar', href: '/calendar', icon: CalendarRange },
  { key: 'assistant', href: '/assistant', icon: Sparkles },
  { key: 'settings', href: '/settings', icon: Settings },
] as const;

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

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

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="border-border bg-card fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r shadow-2xl md:hidden"
          >
            {/* Header */}
            <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
              >
                <Image
                  src="/logo.png"
                  alt="Karsa"
                  width={28}
                  height={28}
                  className="object-contain"
                />
                <span className="text-foreground text-base font-semibold tracking-tight">
                  Karsa
                </span>
              </Link>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {navItems.map(({ key, href, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={key}
                    href={href}
                    className={cn(
                      'relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200',
                      active
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    {active && (
                      <span className="bg-primary-foreground absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full" />
                    )}
                    <Icon className="h-5 w-5 shrink-0" />
                    {t(key as keyof typeof t)}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom */}
            <div className="border-border flex flex-col gap-2 border-t p-3">
              {/* Theme */}
              <button
                onClick={cycleTheme}
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
              >
                <ThemeIcon className="h-5 w-5 shrink-0" />
                <span className="capitalize">{mounted ? (theme ?? 'System') : 'System'}</span>
              </button>

              {/* User */}
              <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                <Image
                  src={
                    user?.avatarUrl ??
                    'https://res.cloudinary.com/dij8whzbd/image/upload/v1780472089/profile_odszu1.jpg'
                  }
                  alt={user?.name ?? 'User'}
                  width={32}
                  height={32}
                  className="ring-border shrink-0 rounded-full ring-2"
                />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="text-foreground truncate text-sm font-medium">
                    {user?.name ?? user?.email ?? 'User'}
                  </span>
                  {user?.email && (
                    <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                  )}
                </div>
                <LogoutButton />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
