import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const cookieStore = await cookies();

  if (!cookieStore.has('access_token')) {
    redirect('/login');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
