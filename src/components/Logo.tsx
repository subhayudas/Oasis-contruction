import Link from 'next/link';

import { getDictionary } from '@/content/dictionary';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';

type Props = {
  locale: Locale;
  /** Rendered as a link back to the home page unless this is the home page. */
  asLink?: boolean;
  className?: string;
  size?: number;
};

/**
 * The client's circular mark, isolated from the black JPEG corners of the
 * supplied logo.jpeg. The artwork itself is untouched — no redraw, no trace.
 */
export function Logo({ locale, asLink = true, className = '', size = 44 }: Props) {
  const t = getDictionary(locale);

  const mark = (
    <span className={`flex items-center gap-3 ${className}`}>
      <img
        src="/brand/oasis-logo-512.png"
        alt={asLink ? t.common.logoAlt : ''}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full shadow-[0_1px_2px_rgba(12,26,43,0.18),0_6px_14px_-10px_rgba(12,26,43,0.6)] ring-1 ring-[rgba(255,255,255,0.9)]"
      />
      <span className="hidden leading-none sm:block">
        <span className="block text-[0.9375rem] font-[560] tracking-[-0.01em]">
          Oasis Construction
        </span>
        <span className="u-label text-ink-50 mt-1.5 block text-[0.5625rem] tracking-[0.2em]">
          Laval &amp; Rive-Nord
        </span>
      </span>
    </span>
  );

  if (!asLink) return mark;

  return (
    <Link
      href={pagePath(locale, 'home')}
      className="-m-1 inline-flex rounded-sm p-1"
      aria-label={`${t.meta.siteName} — ${t.common.home}`}
    >
      {mark}
    </Link>
  );
}
