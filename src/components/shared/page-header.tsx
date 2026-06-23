import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { PageBanner } from '@/components/shared/PageBanner';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between', className)}
    >
      <div className="space-y-0.5">
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

interface PageIntroProps {
  title: string;
  subtitle?: string;
  bannerSubtitle?: string;
  user?: { name?: string; email: string; avatarUrl?: string } | null;
  rightSlot?: ReactNode;
  bottomSlot?: ReactNode;
  actions?: ReactNode;
}

/**
 * Standard page header for dashboard sub-pages:
 * an `<h1>` title row followed by a `<PageBanner>`.
 */
export function PageIntro({
  title,
  subtitle,
  bannerSubtitle,
  user,
  rightSlot,
  bottomSlot,
  actions,
}: PageIntroProps) {
  return (
    <>
      <PageHeader title={title} description={subtitle} actions={actions} />
      <PageBanner
        user={user}
        subtitle={bannerSubtitle}
        rightSlot={rightSlot}
        bottomSlot={bottomSlot}
      />
    </>
  );
}
