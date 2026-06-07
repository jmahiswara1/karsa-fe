import { redirect } from '@/i18n/routing';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();

  if (!cookieStore.has('access_token')) {
    redirect({ href: '/login', locale });
  }

  return <DashboardShell>{children}</DashboardShell>;
}
