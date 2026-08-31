export const locales = ['fr', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

/** BCP-47 tags used for <html lang>, hreflang and structured data. */
export const htmlLang: Record<Locale, string> = { fr: 'fr-CA', en: 'en-CA' };

export const otherLocale: Record<Locale, Locale> = { fr: 'en', en: 'fr' };

export const localeName: Record<Locale, string> = { fr: 'Français', en: 'English' };

export function isLocale(value: string | undefined): value is Locale {
  return value === 'fr' || value === 'en';
}

export const LOCALE_COOKIE = 'oasis_locale';

/**
 * Set only when the visitor picks a language themselves - from the opening
 * dialog or the header rocker. LOCALE_COOKIE alone is not enough to tell an
 * explicit choice from the proxy's Accept-Language guess, and the dialog must
 * only ever ask once.
 */
export const LOCALE_CHOICE_COOKIE = 'oasis_locale_set';

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Each language named in itself, so the choice reads natively either way. */
export const localeChoice: Record<Locale, { name: string; action: string }> = {
  fr: { name: 'Français', action: 'Continuer en français' },
  en: { name: 'English', action: 'Continue in English' },
};
