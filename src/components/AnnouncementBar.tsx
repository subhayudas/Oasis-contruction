'use client';

import Link from 'next/link';

import { IconArrow, IconClose } from './icons';

export const ANNOUNCEMENT_KEY = 'oasis_announcement_dismissed';

/**
 * The seasonal band above the header.
 *
 * It is always in the server-rendered HTML and is hidden, before the first
 * paint, by the inline script in the layout. Deciding its visibility in React
 * instead would mean the bar either appears or disappears at hydration, and
 * because it sits at the very top of the document either one shoves the whole
 * page and costs the site its CLS score.
 *
 * It is dismissible and remembers that choice, because an announcement that
 * cannot be closed stops being an announcement and becomes furniture.
 */
export function AnnouncementBar({
  text,
  cta,
  href,
  dismissLabel,
}: {
  text: string;
  cta: string;
  href: string;
  dismissLabel: string;
}) {
  return (
    <div className="s-ink on-ink relative z-40 print:hidden" data-announcement-bar>
      <div className="u-wrap flex min-h-11 items-center justify-center gap-3 py-1 pr-10">
        <p className="text-dust text-center text-[0.8125rem] leading-snug">
          {text}{' '}
          <Link
            href={href}
            data-cta="announcement"
            data-cta-location="announcement-bar"
            className="text-paper hover:text-brass inline-flex min-h-11 items-center gap-1 underline underline-offset-2 transition-colors"
          >
            {cta}
            <IconArrow className="h-3 w-3" />
          </Link>
        </p>
        <button
          type="button"
          onClick={() => {
            document.documentElement.dataset.announcement = 'hidden';
            try {
              window.localStorage.setItem(ANNOUNCEMENT_KEY, '1');
            } catch {
              /* nothing to remember it with; closing for this visit is enough */
            }
          }}
          aria-label={dismissLabel}
          className="text-dust-2 hover:text-paper absolute right-1 inline-flex h-11 w-11 items-center justify-center transition-colors"
        >
          <IconClose className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
