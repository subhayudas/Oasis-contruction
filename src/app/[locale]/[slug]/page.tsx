import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutPage } from '@/components/pages/AboutPage';
import { AreasPage } from '@/components/pages/AreasPage';
import { ContactPage } from '@/components/pages/ContactPage';
import { PhotoPage } from '@/components/pages/PhotoPage';
import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { ProjectsPage } from '@/components/pages/ProjectsPage';
import { ServicePage } from '@/components/pages/ServicePage';
import { getDictionary } from '@/content/dictionary';
import { services } from '@/content/services';
import { isLocale, locales, type Locale } from '@/lib/i18n';
import {
  alternatesForPage,
  alternatesForService,
  pagePath,
  pageKeyFromSlug,
  pageSlugs,
  serviceKeyFromSlug,
  serviceKeys,
  servicePath,
  simplePages,
  type SimplePageKey,
} from '@/lib/routes';
import { breadcrumbJsonLd, buildMetadata, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import { fill } from '@/content/placeholders';

/**
 * One route for every single-segment page in a language, because French
 * service pages sit at the root of the site next to /contact and /projets
 * rather than under a /services prefix — a homeowner searching "muret Laval"
 * should land on oasis-construction.ca/muret.
 *
 * The slug is resolved against the service map first, then the page map, so a
 * collision would be a build-time impossibility rather than a runtime bug.
 */
export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const key of serviceKeys) params.push({ locale, slug: serviceSlug(locale, key) });
    for (const key of simplePages) params.push({ locale, slug: pageSlugs[key][locale] });
  }
  return params;
}

function serviceSlug(locale: Locale, key: (typeof serviceKeys)[number]): string {
  return servicePath(locale, key).split('/').filter(Boolean).pop() as string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  const serviceKey = serviceKeyFromSlug(locale, slug);
  if (serviceKey) {
    const service = services.find((s) => s.key === serviceKey);
    if (!service) return {};
    return buildMetadata({
      locale,
      title: service.copy[locale].metaTitle,
      description: service.copy[locale].metaDescription,
      path: servicePath(locale, serviceKey),
      alternates: alternatesForService(serviceKey),
    });
  }

  const pageKey = pageKeyFromSlug(locale, slug);
  if (!pageKey) return {};
  const meta = t.meta[pageKey as keyof typeof t.meta] as {
    title: string;
    description: string;
  };
  return buildMetadata({
    locale,
    title: meta.title,
    description: meta.description,
    path: pagePath(locale, pageKey),
    alternates: alternatesForPage(pageKey),
  });
}

const PAGES: Record<SimplePageKey, (props: { locale: Locale }) => React.JSX.Element> = {
  projects: ProjectsPage,
  about: AboutPage,
  contact: ContactPage,
  areas: AreasPage,
  photo: PhotoPage,
  privacy: PrivacyPage,
};

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const serviceKey = serviceKeyFromSlug(locale, slug);
  if (serviceKey) {
    const service = services.find((s) => s.key === serviceKey);
    const faqItems =
      service?.copy[locale].faq.map((item) => ({ q: item.q, a: fill(item.a) })) ?? [];

    return (
      <>
        <ServicePage locale={locale} serviceKey={serviceKey} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              [
                serviceJsonLd(locale, serviceKey),
                faqItems.length > 0 ? faqJsonLd(faqItems) : null,
                breadcrumbJsonLd([
                  { name: t.common.home, path: pagePath(locale, 'home') },
                  { name: t.nav.services, path: pagePath(locale, 'services') },
                  {
                    name: service?.copy[locale].name ?? slug,
                    path: servicePath(locale, serviceKey),
                  },
                ]),
              ].filter(Boolean),
            ),
          }}
        />
      </>
    );
  }

  const pageKey = pageKeyFromSlug(locale, slug);
  if (!pageKey) notFound();

  const Page = PAGES[pageKey];
  const label = pageLabel(pageKey, t);

  return (
    <>
      <Page locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: t.common.home, path: pagePath(locale, 'home') },
              { name: label, path: pagePath(locale, pageKey) },
            ]),
          ),
        }}
      />
    </>
  );
}

function pageLabel(key: SimplePageKey, t: ReturnType<typeof getDictionary>): string {
  switch (key) {
    case 'projects':
      return t.nav.projects;
    case 'about':
      return t.nav.about;
    case 'contact':
      return t.nav.contact;
    case 'areas':
      return t.nav.areas;
    case 'photo':
      return t.photoPage.title;
    case 'privacy':
      return t.footer.privacy;
  }
}
