import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutTeaser } from '@/components/sections/AboutTeaser';
import { ContactPanel } from '@/components/sections/ContactPanel';
import { Hero } from '@/components/sections/Hero';
import { Process } from '@/components/sections/Process';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { getDictionary } from '@/content/dictionary';
import { isLocale, locales } from '@/lib/i18n';
import { alternatesForPage, pagePath } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return buildMetadata({
    locale,
    title: t.meta.home.title,
    description: t.meta.home.description,
    path: pagePath(locale, 'home'),
    alternates: alternatesForPage('home'),
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <Hero locale={locale} />
      <ServicesOverview locale={locale} />
      <SelectedWork locale={locale} />
      <Process locale={locale} />
      <AboutTeaser locale={locale} />
      <ContactPanel locale={locale} />
    </>
  );
}
