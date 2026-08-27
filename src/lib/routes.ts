import { type Locale, locales } from './i18n';

/**
 * Localised URL segments. The key is the stable page identity, which is what
 * the language switcher preserves: /fr/services/reparation-pave-uni and
 * /en/services/interlocking-paver-repair are the same page in two languages.
 */
export const pageSlugs = {
  home: { fr: '', en: '' },
  services: { fr: 'services', en: 'services' },
  projects: { fr: 'realisations', en: 'projects' },
  about: { fr: 'a-propos', en: 'about' },
  contact: { fr: 'contact', en: 'contact' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof pageSlugs;

/** Single-segment pages served by app/[locale]/[page]/page.tsx. */
export const simplePages = ['projects', 'about', 'contact', 'privacy'] as const;
export type SimplePageKey = (typeof simplePages)[number];

export const serviceSlugs = {
  'pave-uni': { fr: 'reparation-pave-uni', en: 'interlocking-paver-repair' },
  muret: { fr: 'reparation-muret', en: 'retaining-wall-repair' },
  'nettoyage-pression': { fr: 'nettoyage-pression', en: 'pressure-washing' },
  drainage: { fr: 'drainage', en: 'drainage' },
} as const satisfies Record<string, Record<Locale, string>>;

export type ServiceKey = keyof typeof serviceSlugs;

export const serviceKeys = Object.keys(serviceSlugs) as ServiceKey[];

export function pagePath(locale: Locale, key: PageKey): string {
  const slug = pageSlugs[key][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

export function servicePath(locale: Locale, key: ServiceKey): string {
  return `/${locale}/${pageSlugs.services[locale]}/${serviceSlugs[key][locale]}`;
}

export function serviceKeyFromSlug(locale: Locale, slug: string): ServiceKey | undefined {
  return serviceKeys.find((key) => serviceSlugs[key][locale] === slug);
}

export function pageKeyFromSlug(locale: Locale, slug: string): SimplePageKey | undefined {
  return simplePages.find((key) => pageSlugs[key][locale] === slug);
}

/** Every localised URL for one logical page — used for hreflang alternates. */
export function alternatesForPage(key: PageKey): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, pagePath(l, key)])) as Record<
    Locale,
    string
  >;
}

export function alternatesForService(key: ServiceKey): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, servicePath(l, key)])) as Record<
    Locale,
    string
  >;
}

/**
 * Given any pathname on the site, return the equivalent pathname in `target`.
 * Falls back to the target home page when the route cannot be mapped.
 */
export function translatePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  const current = parts[0];
  if (current !== 'fr' && current !== 'en') return `/${target}`;
  const rest = parts.slice(1);

  if (rest.length === 0) return `/${target}`;

  if (rest[0] === pageSlugs.services[current]) {
    if (rest.length === 1) return pagePath(target, 'services');
    const serviceKey = serviceKeyFromSlug(current, rest[1] as string);
    return serviceKey ? servicePath(target, serviceKey) : pagePath(target, 'services');
  }

  const pageKey = pageKeyFromSlug(current, rest[0] as string);
  return pageKey ? pagePath(target, pageKey) : `/${target}`;
}
