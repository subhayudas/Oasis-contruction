'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * One observer for the whole document: anything with `.reveal` gets `.is-in`
 * the first time it enters the viewport. Content is never hidden from the
 * accessibility tree, prefers-reduced-motion neutralises the transform in CSS,
 * and elements already on screen at load are revealed on the first tick.
 */
export function RevealScript() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)');
    if (targets.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }

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
    return () => observer.disconnect();
    // Re-runs after every client-side navigation, which brings new targets in.
  }, [pathname]);

  return null;
}
