import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectPage } from '@/components/pages/ProjectPage';
import { getDictionary } from '@/content/dictionary';
import { projectEntries, projectEntryById } from '@/content/projects';
import { isLocale, locales } from '@/lib/i18n';
import { alternatesForProject, pagePath, pageSlugs, projectPath } from '@/lib/routes';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

/**
 * Project detail pages: /projets/<id> in French, /en/projects/<id> in English.
 *
 * The parent segment is language-dependent while the project id is not, which
 * is what lets the language switch keep the visitor on the same project. Any
 * other parent segment is a 404 rather than a second way to reach this page.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    projectEntries.map((entry) => ({
      locale,
      slug: pageSlugs.projects[locale],
      child: entry.id,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string; child: string }>;
}): Promise<Metadata> {
  const { locale, slug, child } = await params;
  if (!isLocale(locale) || slug !== pageSlugs.projects[locale]) return {};
  const entry = projectEntryById(child);
  if (!entry) return {};
  const t = getDictionary(locale);

  return {
    ...buildMetadata({
      locale,
      title: `${entry.title[locale]} - ${t.meta.siteName}`,
      description: entry.caption[locale].slice(0, 300),
      path: projectPath(locale, entry.id),
      alternates: alternatesForProject(entry.id),
    }),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; child: string }>;
}) {
  const { locale, slug, child } = await params;
  if (!isLocale(locale) || slug !== pageSlugs.projects[locale]) notFound();

  const entry = projectEntryById(child);
  if (!entry) notFound();

  const t = getDictionary(locale);

  return (
    <>
      <ProjectPage locale={locale} entry={entry} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t.common.home, path: pagePath(locale, 'home') },
              { name: t.nav.projects, path: pagePath(locale, 'projects') },
              { name: entry.title[locale], path: projectPath(locale, entry.id) },
            ]),
          ),
        }}
      />
    </>
  );
}
