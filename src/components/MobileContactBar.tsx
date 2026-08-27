import Link from 'next/link';

import { getDictionary } from '@/content/dictionary';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';
import { IconPhone } from './icons';

/**
 * Two thumb-sized actions pinned to the bottom on small screens. The page adds
 * matching bottom padding so the bar never covers content, and it is hidden
 * from the desktop layout entirely.
 */
export function MobileContactBar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div
      className="s-tray fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line-strong)] px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-14px_30px_-24px_rgba(12,26,43,0.8)] md:hidden print:hidden"
      data-mobile-contact-bar
    >
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={site.phone.href}
          className="btn btn-quarry rounded-sm"
          aria-label={`${t.common.callUs} : ${site.phone.display}`}
        >
          <IconPhone className="h-4 w-4" />
          {t.common.call}
        </a>
        <Link href={pagePath(locale, 'contact')} className="btn btn-stone rounded-sm">
          {t.common.quoteShort}
        </Link>
      </div>
    </div>
  );
}
