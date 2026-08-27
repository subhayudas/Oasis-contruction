import type { MetadataRoute } from 'next';

import { htmlLang, locales } from '@/lib/i18n';
import {
  alternatesForPage,
  alternatesForService,
  pagePath,
  pageSlugs,
  serviceKeys,
  servicePath,
  type PageKey,
} from '@/lib/routes';
import { absolute } from '@/lib/seo';

const PRIORITY: Record<PageKey, number> = {
  home: 1,
  services: 0.9,
  projects: 0.8,
  contact: 0.8,
  about: 0.6,
  privacy: 0.2,
};

function languagesFor(alternates: Record<string, string>) {
  return Object.fromEntries(
    locales.map((locale) => [htmlLang[locale], absolute(alternates[locale] as string)]),
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-08-26');
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const key of Object.keys(pageSlugs) as PageKey[]) {
      entries.push({
        url: absolute(pagePath(locale, key)),
        lastModified,
        changeFrequency: key === 'home' ? 'monthly' : 'yearly',
        priority: PRIORITY[key],
        alternates: { languages: languagesFor(alternatesForPage(key)) },
      });
    }

    for (const key of serviceKeys) {
      entries.push({
        url: absolute(servicePath(locale, key)),
        lastModified,
        changeFrequency: 'yearly',
        priority: 0.8,
        alternates: { languages: languagesFor(alternatesForService(key)) },
      });
    }
  }

  return entries;
}
