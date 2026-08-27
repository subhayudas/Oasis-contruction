import type { Metadata } from 'next';

import { site } from '@/content/site';
import { services } from '@/content/services';
import { htmlLang, type Locale, locales } from './i18n';
import { pagePath, servicePath, type ServiceKey } from './routes';

export const BASE_URL = site.url;

export function absolute(path: string): string {
  return `${BASE_URL}${path}`;
}

type BuildMeta = {
  locale: Locale;
  title: string;
  description: string;
  /** Canonical path for this locale, e.g. /fr/services. */
  path: string;
  /** Every locale's path for this same page. */
  alternates: Record<Locale, string>;
};

export function buildMetadata({
  locale,
  title,
  description,
  path,
  alternates,
}: BuildMeta): Metadata {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[htmlLang[l]] = absolute(alternates[l]);
  languages['x-default'] = absolute(alternates.fr);

  return {
    title,
    description,
    alternates: { canonical: absolute(path), languages },
    openGraph: {
      type: 'website',
      siteName: site.name,
      title,
      description,
      url: absolute(path),
      locale: htmlLang[locale].replace('-', '_'),
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => htmlLang[l].replace('-', '_')),
      images: [
        {
          url: absolute(`/brand/og-${locale}.jpg`),
          width: 1200,
          height: 630,
          alt: locale === 'fr' ? site.taglineFr : site.taglineEn,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absolute(`/brand/og-${locale}.jpg`)],
    },
  };
}

/* ------------------------------------------------------------------ JSON-LD */

/**
 * Only verified facts are emitted. No aggregate rating, no review count, no
 * founding date, no price range, no municipality or postal code — the intake
 * gives a street address without either, and neither is invented here.
 */
export function localBusinessJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${BASE_URL}/#business`,
    name: site.name,
    url: absolute(pagePath(locale, 'home')),
    description: locale === 'fr' ? site.taglineFr : site.taglineEn,
    slogan: locale === 'fr' ? site.taglineFr : site.taglineEn,
    image: absolute('/brand/oasis-logo-1024.png'),
    logo: absolute('/brand/oasis-logo-1024.png'),
    telephone: site.phone.e164,
    email: site.email.display,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...site.hours.days],
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    sameAs: [site.social.instagram, site.social.facebook],
    knowsLanguage: ['fr-CA', 'en-CA'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:
        locale === 'fr' ? 'Services d’aménagement extérieur' : 'Exterior construction services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.copy[locale].name,
          description: s.copy[locale].short,
          url: absolute(servicePath(locale, s.key)),
        },
      })),
    },
  };
}

export function serviceJsonLd(locale: Locale, key: ServiceKey) {
  const service = services.find((s) => s.key === key);
  if (!service) return null;
  const copy = service.copy[locale];
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: copy.name,
    description: copy.metaDescription,
    serviceType: copy.name,
    url: absolute(servicePath(locale, key)),
    provider: { '@id': `${BASE_URL}/#business` },
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    availableLanguage: ['fr-CA', 'en-CA'],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: site.name,
    inLanguage: htmlLang[locale],
    publisher: { '@id': `${BASE_URL}/#business` },
  };
}
