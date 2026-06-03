'use client';

import { cn } from '@/lib/utils';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth.store';
import { LogoutButton } from '@/components/auth/LogoutButton';

import Image from 'next/image';
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  FileText,
  CalendarDays,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'tasks', href: '/tasks', icon: CheckSquare },
  { key: 'projects', href: '/projects', icon: FolderOpen },
  { key: 'notes', href: '/notes', icon: FileText },
  { key: 'planner', href: '/planner', icon: CalendarDays },
  { key: 'assistant', href: '/assistant', icon: Sparkles },
] as const;

const bottomItems = [{ key: 'settings', href: '/settings', icon: Settings }] as const;

export function Sidebar() {
  const t = useTranslations('Sidebar');
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== null) setCollapsed(stored === 'true');
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-card relative sticky top-0 hidden h-screen shrink-0 flex-col md:flex"
      style={{ boxShadow: '2px 0 12px 0 rgba(75, 123, 236, 0.07)' }}
    >
      {/* Logo */}
      <div className="border-border/50 flex h-16 shrink-0 items-center overflow-hidden border-b px-3.5">
        <Link
          href="/dashboard"
          className="flex items-center gap-4 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.png"
            alt="Karsa"
            width={30}
            height={30}
            className="shrink-0 object-contain"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="text-foreground overflow-hidden text-base font-bold tracking-tight whitespace-nowrap"
              >
                Karsa
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3">
        {navItems.map(({ key, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={href}
              title={collapsed ? t(key as keyof typeof t) : undefined}
              className={cn(
                'group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-300',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'h-4.5 w-4.5 shrink-0',
                  active
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground group-hover:text-foreground',
                )}
                style={{ width: '1.125rem', height: '1.125rem' }}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {t(key as keyof typeof t)}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-border/50 flex flex-col gap-0.5 border-t px-2 py-3">
        {/* Settings */}
        {bottomItems.map(({ key, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={key}
              href={href}
              title={collapsed ? t(key as keyof typeof t) : undefined}
              className={cn(
                'group flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-300',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'shrink-0',
                  active ? 'text-primary-foreground' : 'text-muted-foreground',
                )}
                style={{ width: '1.125rem', height: '1.125rem' }}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {t(key as keyof typeof t)}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* User + Logout */}
        <div className="flex h-[50px] items-center gap-4 rounded-xl px-3 transition-all duration-300">
          <Image
            src={
              user?.avatarUrl ??
              'https://res.cloudinary.com/dij8whzbd/image/upload/v1780472089/profile_odszu1.jpg'
            }
            alt={user?.name ?? 'User'}
            width={30}
            height={30}
            className="ring-border -ml-1.5 shrink-0 rounded-full ring-2"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex min-w-0 flex-1 flex-col overflow-hidden"
              >
                <span className="text-foreground truncate text-xs font-semibold">
                  {user?.name ?? user?.email ?? 'User'}
                </span>
                {user?.email && (
                  <span className="text-muted-foreground truncate text-[10px]">{user.email}</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <LogoutButton />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleCollapsed}
        title={collapsed ? t('expand') : t('collapse')}
        className="bg-card text-muted-foreground ring-border/60 hover:bg-primary hover:text-primary-foreground hover:ring-primary absolute top-20 -right-3.5 flex h-7 w-7 items-center justify-center rounded-full shadow-md ring-1 transition-all"
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </motion.aside>
  );
}
