import {
  isLocale,
  LOCALE_CHOICE_COOKIE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  type Locale,
} from './i18n';

/**
 * Browser-side half of the language memory. The proxy writes LOCALE_COOKIE on
 * every request from what it can infer; only these helpers write the marker
 * that says the visitor decided for themselves.
 */

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;

  for (const part of document.cookie.split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
}

function writeCookie(name: string, value: string): void {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${LOCALE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

/** True once the visitor has answered the language dialog, in any past visit. */
export function hasChosenLocale(): boolean {
  return readCookie(LOCALE_CHOICE_COOKIE) === '1';
}

export function storedLocale(): Locale | undefined {
  const value = readCookie(LOCALE_COOKIE);
  return isLocale(value) ? value : undefined;
}

/**
 * Record a deliberate choice. Writing LOCALE_COOKIE here as well means "/" and
 * any unprefixed link land in the chosen language immediately, without waiting
 * for the proxy to observe the next locale-prefixed URL.
 */
export function rememberLocale(locale: Locale): void {
  if (typeof document === 'undefined') return;
  writeCookie(LOCALE_COOKIE, locale);
  writeCookie(LOCALE_CHOICE_COOKIE, '1');
}
