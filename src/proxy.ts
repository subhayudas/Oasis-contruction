import { NextResponse, type NextRequest } from 'next/server';

import { defaultLocale, isLocale, type Locale } from '@/lib/i18n';

/**
 * French lives at the root of the site and English under /en, but there is
 * only one set of route files, under app/[locale]. This proxy is what joins
 * the two: it rewrites `/muret` onto `/fr/muret` without the visitor's URL
 * ever changing, and it 301s the old `/fr/...` and `/fr/services/...` URLs
 * onto their new homes so nothing that was linked or indexed breaks.
 *
 * Language is never guessed from Accept-Language any more. Guessing sent
 * French-speaking homeowners in Laval to an English page whenever their
 * browser happened to be configured in English, and it made "/" ambiguous to
 * crawlers. The root is French, /en is English, and the header switch is how
 * anyone changes it.
 */

/** Old URL → new URL. Everything that was ever published, mapped once. */
const LEGACY: Record<string, string> = {
  '/fr': '/',
  '/fr/services': '/services',
  '/fr/services/reparation-pave-uni': '/pave-uni',
  '/fr/services/reparation-muret': '/muret',
  '/fr/services/nettoyage-pression': '/lavage-sous-pression',
  '/fr/services/drainage': '/drainage',
  '/fr/realisations': '/projets',
  '/fr/a-propos': '/a-propos',
  '/fr/contact': '/contact',
  '/fr/confidentialite': '/confidentialite',

  '/en/services/interlocking-paver-repair': '/en/interlocking-pavers',
  '/en/services/retaining-wall-repair': '/en/retaining-walls',
  '/en/services/pressure-washing': '/en/pressure-washing',
  '/en/services/drainage': '/en/drainage',
};

/** Paths that must reach the app untouched. */
function isPassThrough(pathname: string): boolean {
  return (
    pathname === '/lp' ||
    pathname.startsWith('/lp/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/')
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const legacy = LEGACY[pathname.replace(/\/+$/, '') || '/'];
  if (legacy) {
    const url = request.nextUrl.clone();
    url.pathname = legacy;
    url.search = search;
    return NextResponse.redirect(url, 301);
  }

  if (isPassThrough(pathname)) return NextResponse.next();

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  // Anything still under /fr is a stale URL: strip the prefix permanently so
  // the root French URL is the only one that is ever indexed.
  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${segments.slice(1).join('/')}` || '/';
    url.search = search;
    return NextResponse.redirect(url, 301);
  }

  // English already matches the route tree.
  if (isLocale(first)) return NextResponse.next();

  // Everything else is French, including unknown paths - which is what puts
  // the visitor on the branded French 404 rather than a bare one.
  const locale: Locale = defaultLocale;
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|images|brand|favicon\\.ico|icon\\.png|apple-icon\\.png|robots\\.txt|sitemap\\.xml|.*\\..*).*)',
  ],
};
