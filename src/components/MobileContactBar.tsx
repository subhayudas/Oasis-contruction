import { getDictionary } from '@/content/dictionary';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';
import { OpenGuidedForm } from './guided/OpenGuidedForm';
import { IconCamera, IconPhone } from './icons';

/**
 * Two thumb-sized actions pinned to the bottom on small screens: call, and
 * send a photo. They are the two things a homeowner standing in front of the
 * problem can actually do in one motion.
 *
 * The photo key opens the guided form in place rather than navigating: the
 * visitor is on a page they chose to be on, and taking them off it to ask
 * six questions costs a page load and the scroll position they had. With
 * JavaScript unavailable it is still a link to the photo page.
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
        <OpenGuidedForm
          href={pagePath(locale, 'photo')}
          label={t.common.photoShort}
          location="mobile-sticky-bar"
          className="btn btn-stone btn-compact"
        >
          <IconCamera className="h-4 w-4" />
        </OpenGuidedForm>
      </div>
    </div>
  );
}
