'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { useBrowserValue } from '@/lib/use-browser-value';

const KEY = 'oasis_consent';

export type ConsentValue = 'granted' | 'denied';

/**
 * Quebec's Law 25 consent banner.
 *
 * The site is built so that declining costs the visitor nothing: the language
 * cookie is strictly necessary and is set either way, and the measurement
 * container is only ever loaded on an explicit "accept". That is why the two
 * buttons carry equal visual weight — a decline button styled as an
 * afterthought is not a free choice, and Law 25 asks for a free choice.
 *
 * The answer is pushed to the dataLayer as a Consent Mode v2 update, so a GTM
 * container configured for consent mode does the right thing with no further
 * wiring. Until the visitor answers, consent is denied.
 */
export function CookieBanner({
  labels,
  privacyHref,
}: {
  labels: {
    title: string;
    body: string;
    accept: string;
    refuse: string;
    link: string;
    label: string;
  };
  privacyHref: string;
}) {
  // 'pending' on the server pass: the banner is not in the HTML, so it cannot
  // flash for someone who answered months ago.
  const [stored, write] = useBrowserValue(KEY, 'pending');
  const decided = stored === 'granted' || stored === 'denied';

  // Telling the tag container what the standing answer is *is* an external
  // system update, which is what an effect is for.
  useEffect(() => {
    pushConsent(decided ? (stored as ConsentValue) : 'denied');
  }, [decided, stored]);

  if (stored === 'pending' || decided) return null;

  return (
    <div
      role="dialog"
      aria-label={labels.label}
      className="glass-panel fixed inset-x-3 bottom-3 z-[60] max-w-xl p-5 shadow-[0_18px_40px_-24px_rgba(26,22,16,0.7)] md:inset-x-auto md:bottom-5 md:left-5 print:hidden"
      data-cookie-banner
    >
      <p className="text-ink text-[0.9375rem] font-[600]">{labels.title}</p>
      <p className="u-body mt-2 text-[0.875rem]">{labels.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => write('granted')}
          className="btn btn-stone btn-compact flex-1 sm:flex-none"
        >
          {labels.accept}
        </button>
        <button
          type="button"
          onClick={() => write('denied')}
          className="btn btn-quarry btn-compact flex-1 sm:flex-none"
        >
          {labels.refuse}
        </button>
        <Link href={privacyHref} className="link-rule ml-auto min-h-11 text-[0.8125rem]">
          {labels.link}
        </Link>
      </div>
    </div>
  );
}

function pushConsent(value: ConsentValue) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: 'consent_update',
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}
