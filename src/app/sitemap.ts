import type { MetadataRoute } from 'next';

import { htmlLang, locales } from '@/lib/i18n';
import { projectEntries } from '@/content/projects';
import {
  alternatesForPage,
  alternatesForProject,
  alternatesForService,
  pagePath,
  pageSlugs,
  projectPath,
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
  photo: 0.7,
  about: 0.6,
  areas: 0.5,
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
        priority: 0.9,
        alternates: { languages: languagesFor(alternatesForService(key)) },
      });
    }

    for (const entry of projectEntries) {
      entries.push({
        url: absolute(projectPath(locale, entry.id)),
        lastModified,
        changeFrequency: 'yearly',
        priority: 0.5,
        alternates: { languages: languagesFor(alternatesForProject(entry.id)) },
      });
    }
  }

  // The paid-traffic landing pages are deliberately absent: they are noindex,
  // and listing a noindex URL in a sitemap is a contradiction crawlers report.

  return entries;
}
