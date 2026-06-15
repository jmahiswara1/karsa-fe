'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function SettingsFooter() {
  const tSettings = useTranslations('Settings');

  return (
    <footer className="border-border mt-8 border-t py-6 text-center">
      <p className="text-muted-foreground text-xs">{tSettings('footer_version')}</p>
      <div className="mt-2 flex justify-center gap-4">
        <Link
          href="/privacy"
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          {tSettings('footer_privacy')}
        </Link>
        <Link
          href="/terms"
          className="text-muted-foreground hover:text-foreground text-xs transition-colors"
        >
          {tSettings('footer_terms')}
        </Link>
      </div>
    </footer>
  );
}
