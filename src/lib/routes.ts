import { defaultLocale, type Locale, locales } from './i18n';

/**
 * URL architecture.
 *
 * French is the primary market and lives at the root: /pave-uni, /projets,
 * /contact. English is the secondary market and lives under /en. The proxy
 * rewrites the root French paths onto the [locale] tree, so there is one set
 * of route files and one layout that still knows its language.
 *
 * The key is the stable page identity, which is what the language switcher
 * preserves: /muret and /en/retaining-walls are the same page in two
 * languages.
 */
export const pageSlugs = {
  home: { fr: '', en: '' },
  services: { fr: 'services', en: 'services' },
  projects: { fr: 'projets', en: 'projects' },
  about: { fr: 'a-propos', en: 'about' },
  contact: { fr: 'contact', en: 'contact' },
  areas: { fr: 'secteurs-desservis', en: 'service-areas' },
  photo: { fr: 'envoyer-une-photo', en: 'send-a-photo' },
  privacy: { fr: 'confidentialite', en: 'privacy' },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof pageSlugs;

/** Single-segment pages resolved by app/[locale]/[slug]/page.tsx. */
export const simplePages = [
  'projects',
  'about',
  'contact',
  'areas',
  'photo',
  'privacy',
] as const;
export type SimplePageKey = (typeof simplePages)[number];

/**
 * Service pages sit at the root of their language, not under /services - a
 * homeowner searching "muret Laval" should land on oasis-construction.ca/muret.
 * /services remains as a hub that links to all six.
 */
export const serviceSlugs = {
  'pave-uni': { fr: 'pave-uni', en: 'interlocking-pavers' },
  muret: { fr: 'muret', en: 'retaining-walls' },
  margelle: { fr: 'margelle', en: 'steps-and-coping' },
  drainage: { fr: 'drainage', en: 'drainage' },
  'lavage-sous-pression': { fr: 'lavage-sous-pression', en: 'pressure-washing' },
  'amenagement-exterieur': { fr: 'amenagement-exterieur', en: 'landscape-construction' },
} as const satisfies Record<string, Record<Locale, string>>;

export type ServiceKey = keyof typeof serviceSlugs;

export const serviceKeys = Object.keys(serviceSlugs) as ServiceKey[];

/* ------------------------------------------------------------ path builders */

/** `/` for French, `/en` for English - the prefix every other path starts with. */
export function localeRoot(locale: Locale): string {
  return locale === defaultLocale ? '' : `/${locale}`;
}

export function pagePath(locale: Locale, key: PageKey): string {
  const slug = pageSlugs[key][locale];
  const root = localeRoot(locale);
  if (!slug) return root || '/';
  return `${root}/${slug}`;
}

export function servicePath(locale: Locale, key: ServiceKey): string {
  return `${localeRoot(locale)}/${serviceSlugs[key][locale]}`;
}

export function projectPath(locale: Locale, id: string): string {
  return `${pagePath(locale, 'projects')}/${id}`;
}

/** Paid-traffic landing pages. French only, and noindex. */
export const landingSlugs = ['pave-uni-reparation', 'muret-reparation'] as const;
export type LandingKey = (typeof landingSlugs)[number];

export function landingPath(key: LandingKey): string {
  return `/lp/${key}`;
}

/* ----------------------------------------------------------- slug resolvers */

export function serviceKeyFromSlug(locale: Locale, slug: string): ServiceKey | undefined {
  return serviceKeys.find((key) => serviceSlugs[key][locale] === slug);
}

export function pageKeyFromSlug(locale: Locale, slug: string): SimplePageKey | undefined {
  return simplePages.find((key) => pageSlugs[key][locale] === slug);
}

/* --------------------------------------------------------------- alternates */

/** Every localised URL for one logical page - used for hreflang alternates. */
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

export function alternatesForProject(id: string): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, projectPath(l, id)])) as Record<
    Locale,
    string
  >;
}

/* ------------------------------------------------------------- translation */

/** The locale a browser pathname belongs to. Root paths are French. */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr';
}

/**
 * Given any pathname on the site, return the equivalent pathname in `target`.
 * Falls back to the target home page when the route cannot be mapped.
 */
export function translatePath(pathname: string, target: Locale): string {
  const current = localeFromPath(pathname);
  if (current === target) return pathname;

  const parts = pathname.split('/').filter(Boolean);
  const rest = current === 'fr' ? parts : parts.slice(1);

  if (rest.length === 0) return pagePath(target, 'home');

  const first = rest[0] as string;

  // Services hub.
  if (first === pageSlugs.services[current]) return pagePath(target, 'services');

  const serviceKey = serviceKeyFromSlug(current, first);
  if (serviceKey) return servicePath(target, serviceKey);

  const pageKey = pageKeyFromSlug(current, first);
  if (pageKey) {
    // A project detail page keeps its id, which is language-independent.
    if (pageKey === 'projects' && rest[1]) return projectPath(target, rest[1] as string);
    return pagePath(target, pageKey);
  }

  return pagePath(target, 'home');
}
