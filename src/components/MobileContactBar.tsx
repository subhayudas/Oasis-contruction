import Link from 'next/link';

import { getDictionary } from '@/content/dictionary';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';
import { IconCamera, IconPhone } from './icons';

/**
 * Two thumb-sized actions pinned to the bottom on small screens: call, and
 * send a photo. They are the two things a homeowner standing in front of the
 * problem can actually do in one motion, which is why the quote form is not
 * one of them — the form is a page away and the phone is not.
 *
 * The page adds matching bottom padding so the bar never covers a submit
 * button, and it is hidden from the desktop layout entirely.
 */
export function MobileContactBar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div
      className="s-tray fixed inset-x-0 bottom-0 z-30 border-t border-[var(--line-strong)] px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-2px_8px_rgba(26,22,16,0.1)] md:hidden print:hidden"
      data-mobile-contact-bar
    >
      <div className="grid grid-cols-2 gap-2.5">
        <a
          href={site.phone.href}
          data-cta={t.common.call}
          data-cta-location="mobile-sticky-bar"
          className="btn btn-brass btn-compact"
          aria-label={`${t.common.callUs} : ${site.phone.display}`}
        >
          <IconPhone className="h-4 w-4" />
          {t.common.call}
        </a>
        <Link
          href={pagePath(locale, 'photo')}
          data-cta={t.common.photoShort}
          data-cta-location="mobile-sticky-bar"
          className="btn btn-stone btn-compact"
        >
          <IconCamera className="h-4 w-4" />
          {t.common.photoShort}
        </Link>
      </div>
    </div>
  );
}
