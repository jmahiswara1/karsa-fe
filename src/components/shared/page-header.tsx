import { ReactNode } from 'react';
import { PageBanner } from '@/components/shared/PageBanner';

interface PageIntroProps {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  bottomSlot?: ReactNode;
  actions?: ReactNode;
}

/**
 * Standard page header for dashboard sub-pages:
 * a `<PageBanner>` with title, subtitle, and slots (no greeting/avatar).
 */
export function PageIntro({ title, subtitle, rightSlot, bottomSlot, actions }: PageIntroProps) {
  const combinedRightSlot = actions ? (
    <div className="flex items-center gap-2">
      {actions}
      {rightSlot}
    </div>
  ) : (
    rightSlot
  );

  return (
    <PageBanner
      title={title}
      subtitle={subtitle}
      rightSlot={combinedRightSlot}
      bottomSlot={bottomSlot}
    />
  );
}
