'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * One observer for the whole document: anything with `.reveal` gets `.is-in`
 * the first time it enters the viewport. Content is never hidden from the
 * accessibility tree, prefers-reduced-motion neutralises the transform in CSS,
 * and elements already on screen at load are revealed on the first tick.
 *
 * The same effect carries two other page-wide bits of state, because both are
 * the same question asked of the viewport and neither deserves an observer of
 * its own:
 *
 *   `data-scrolled` - the page has moved under the sticky header, so the bar
 *                      thickens its glass and lengthens its shadow.
 *   `data-hero-cta` - the hero's own buttons are still on screen, so the
 *                      pinned thumb bar stays out of the way until they go.
 *
 * Both are written to `<html>` and consumed entirely in CSS. Pages with no
 * hero never set the second one, which is what keeps the thumb bar visible
 * everywhere else.
 */
export function RevealScript() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const cleanups: Array<() => void> = [];
    const supported = 'IntersectionObserver' in window;

    /* ------------------------------------------------------------ reveals */

    const targets = document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)');

    if (targets.length > 0) {
      if (!supported) {
        targets.forEach((el) => el.classList.add('is-in'));
      } else {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add('is-in');
              observer.unobserve(entry.target);
            }
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
        );

        targets.forEach((el) => observer.observe(el));
        cleanups.push(() => observer.disconnect());
      }
    }

    /* ----------------------------------------------------- photograph load */

    // Only images the browser has not already decoded, and never an eager one:
    // fading the hero in would push the largest paint back for no gain.
    const images = document.querySelectorAll<HTMLImageElement>(
      'img[loading="lazy"]:not([data-fade])',
    );

    for (const img of images) {
      img.dataset.fade = '';
      if (img.complete) continue;

      img.classList.add('img-fade');
      const done = () => img.classList.add('is-loaded');
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
      cleanups.push(() => {
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
      });
    }

    /* ----------------------------------------------------- viewport flags */

    if (supported) {
      const sentinels = document.querySelectorAll<HTMLElement>('[data-sentinel]');

      if (sentinels.length > 0) {
        const flags = new IntersectionObserver((entries) => {
          for (const entry of entries) {
            const kind = (entry.target as HTMLElement).dataset.sentinel;
            if (kind === 'top') {
              root.dataset.scrolled = entry.isIntersecting ? 'false' : 'true';
            } else if (kind === 'hero-cta') {
              root.dataset.heroCta = entry.isIntersecting ? 'visible' : 'gone';
            }
          }
        });

        sentinels.forEach((el) => flags.observe(el));
        cleanups.push(() => flags.disconnect());
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
      // A page without a hero must not inherit the previous page's answer.
      delete root.dataset.heroCta;
    };
    // Re-runs after every client-side navigation, which brings new targets in.
  }, [pathname]);

  return null;
}
