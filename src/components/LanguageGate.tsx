'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { localeChoice, otherLocale, type Locale } from '@/lib/i18n';
import { hasChosenLocale, rememberLocale } from '@/lib/locale-cookie';
import { translatePath } from '@/lib/routes';
import { IconArrow, IconClose } from './icons';

export type GateLabels = {
  /** "LANGUE · LANGUAGE" — the bilingual eyebrow. */
  eyebrow: string;
  /** Both headings, page language first, so either visitor reads their own. */
  titles: [string, string];
  note: string;
  dismiss: string;
};

/**
 * The opening language choice. It appears once — the first time a visitor
 * reaches the site with no recorded decision — and never again, because both
 * faces write the choice cookie the proxy and the header rocker already share.
 *
 * Each face is a real link to the equivalent page in that language, so nobody
 * is dropped at the home page for answering, and the dialog never blocks the
 * site: Escape or the close button keeps the language already on screen.
 */
export function LanguageGate({ locale, labels }: { locale: Locale; labels: GateLabels }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? `/${locale}`;
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Only ever mounted open for a visitor with no recorded choice. Reading the
  // cookie after mount rather than on the server keeps every page static and
  // keeps returning visitors from seeing a flash of the dialog.
  useEffect(() => {
    if (!hasChosenLocale()) setOpen(true);
  }, []);

  const choose = useCallback((chosen: Locale) => {
    rememberLocale(chosen);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the first language rather than the dismiss button, so Enter on a
    // freshly opened dialog answers the question instead of ducking it.
    const panel = panelRef.current;
    (
      panel?.querySelector<HTMLElement>('a[hreflang]') ??
      panel?.querySelector<HTMLElement>('a, button')
    )?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        choose(locale);
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, locale, choose]);

  if (!open) return null;

  // The language already on screen is offered first: it is the one the proxy
  // inferred, and the one Enter selects for a keyboard visitor.
  const ordered: Locale[] = [locale, otherLocale[locale]];

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-5">
      <div className="gate-veil bg-ink/55 absolute inset-0" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="gate-panel glass-panel clip-notch-sm relative w-full max-w-[24.5rem] rounded-[3px]"
      >
        <button
          type="button"
          onClick={() => choose(locale)}
          aria-label={labels.dismiss}
          className="link-quiet absolute top-2.5 right-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-[1px]"
        >
          <IconClose className="h-4 w-4" />
        </button>

        <div className="relative z-10 px-7 pt-8 pb-6 text-center">
          <img
            src="/brand/oasis-logo-512.png"
            alt=""
            width={52}
            height={52}
            style={{ width: 52, height: 52 }}
            className="mx-auto rounded-full shadow-[0_1px_2px_rgba(12,26,43,0.18),0_8px_18px_-12px_rgba(12,26,43,0.6)] ring-1 ring-[rgba(255,255,255,0.85)]"
          />

          <p className="u-label text-bronze mt-5">{labels.eyebrow}</p>
          <span className="u-tick mx-auto mt-3" />

          <h2 id={titleId} className="u-h3 mt-4">
            {labels.titles[0]}
          </h2>
          <p className="u-accent text-ink-50 mt-1 text-[1.0625rem]">{labels.titles[1]}</p>
        </div>

        <div className="relative z-10 flex flex-col gap-2.5 px-7">
          {ordered.map((l) => (
            <Link
              key={l}
              href={translatePath(pathname, l)}
              hrefLang={l}
              lang={l}
              prefetch={false}
              onClick={(event) => {
                // Same language: nothing to navigate to, just record and close.
                if (l === locale) event.preventDefault();
                choose(l);
              }}
              className="btn btn-quarry group rounded-sm py-3 text-left"
            >
              <span className="gate-code" aria-hidden="true">
                {l.toUpperCase()}
              </span>

              <span className="flex-1 leading-tight">
                <span className="block text-[1.0625rem] font-[560] tracking-[-0.015em]">
                  {localeChoice[l].name}
                </span>
                <span className="u-meta mt-1 block">{localeChoice[l].action}</span>
              </span>

              <IconArrow className="text-ink-50 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>

        <p className="u-meta relative z-10 px-7 pt-5 pb-7 text-center text-[0.75rem]">
          {labels.note}
        </p>
      </div>
    </div>
  );
}
