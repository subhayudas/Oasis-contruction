import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { Crumb } from '@/components/Breadcrumbs';
import { AboutPage } from '@/components/pages/AboutPage';
import { ContactPage } from '@/components/pages/ContactPage';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { ProjectsPage } from '@/components/pages/ProjectsPage';
import { getDictionary } from '@/content/dictionary';
import { isLocale, locales, type Locale } from '@/lib/i18n';
import {
  alternatesForPage,
  pageKeyFromSlug,
  pagePath,
  pageSlugs,
  simplePages,
  type SimplePageKey,
} from '@/lib/routes';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

/**
 * The four single-segment pages share this route so their URL slugs can be
 * translated (/fr/realisations ↔ /en/projects) while the page identity stays
 * stable for the language switcher and for hreflang.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    simplePages.map((key) => ({ locale, page: pageSlugs[key][locale] })),
  );
}

function titleFor(locale: Locale, key: SimplePageKey) {
  const t = getDictionary(locale);
  return {
    projects: t.nav.projects,
    about: t.nav.about,
    contact: t.nav.contact,
    privacy: t.footer.privacy,
  }[key];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}): Promise<Metadata> {
  const { locale, page } = await params;
  if (!isLocale(locale)) return {};
  const key = pageKeyFromSlug(locale, page);
  if (!key) return {};

  const t = getDictionary(locale);
  const meta = t.meta[key];

  return buildMetadata({
    locale,
    title: meta.title,
    description: meta.description,
    path: pagePath(locale, key),
    alternates: alternatesForPage(key),
  });
}

export default async function SimplePage({
  params,
}: {
  params: Promise<{ locale: string; page: string }>;
}) {
  const { locale, page } = await params;
  if (!isLocale(locale)) notFound();
  const key = pageKeyFromSlug(locale, page);
  if (!key) notFound();

  const t = getDictionary(locale);
  const crumbs: Crumb[] = [
    { name: t.common.home, path: pagePath(locale, 'home') },
    { name: titleFor(locale, key), path: pagePath(locale, key) },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />
      {key === 'projects' ? <ProjectsPage locale={locale} crumbs={crumbs} /> : null}
      {key === 'about' ? <AboutPage locale={locale} crumbs={crumbs} /> : null}
      {key === 'contact' ? <ContactPage locale={locale} crumbs={crumbs} /> : null}
      {key === 'privacy' ? <PrivacyPage locale={locale} crumbs={crumbs} /> : null}
    </>
  );
}
