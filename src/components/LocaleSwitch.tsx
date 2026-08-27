'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { type Locale, locales } from '@/lib/i18n';
import { rememberLocale } from '@/lib/locale-cookie';
import { translatePath } from '@/lib/routes';

type Props = {
  locale: Locale;
  /** "Langue" / "Language" — labels the group for assistive tech. */
  groupLabel: string;
  /** Description of what switching does, e.g. "Voir cette page en anglais". */
  switchLabel: string;
  className?: string;
};

/**
 * An engraved two-position rocker. Each face is a real link to the equivalent
 * page in the other language, so it works without JavaScript once hydrated and
 * keeps the visitor on the same content rather than dropping them at the home
 * page. The pathname is only needed to compute that equivalent route.
 *
 * Using it counts as deciding, so it records the same choice the opening
 * dialog does and the dialog never asks again.
 */
export function LocaleSwitch({ locale, groupLabel, switchLabel, className = '' }: Props) {
  const pathname = usePathname() ?? `/${locale}`;

  return (
    <div
      className={`switch-well ${className}`}
      role="group"
      aria-label={groupLabel}
      data-locale-switch
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={translatePath(pathname, l)}
            hrefLang={l}
            lang={l}
            onClick={() => rememberLocale(l)}
            className="switch-face"
            aria-current={active ? 'true' : 'false'}
            aria-label={active ? undefined : switchLabel}
            prefetch={false}
          >
            {l.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
