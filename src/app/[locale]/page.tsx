import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AboutTeaser } from '@/components/sections/AboutTeaser';
import { Faq } from '@/components/sections/Faq';
import { FinalCta } from '@/components/sections/FinalCta';
import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { Process } from '@/components/sections/Process';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { ServicesOverview } from '@/components/sections/ServicesOverview';
import { Solution } from '@/components/sections/Solution';
import { TestimonialsSection } from '@/components/sections/Testimonials';
import { homeFaq } from '@/content/faq';
import { fillOrNull } from '@/content/placeholders';
import { isLocale, locales } from '@/lib/i18n';
import { alternatesForPage, pagePath } from '@/lib/routes';
import { buildMetadata, faqJsonLd } from '@/lib/seo';
import { getDictionary } from '@/content/dictionary';

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

/**
 * The homepage, in the order the visitor's questions arrive:
 *
 *   1  announcement   (in the layout) why now
 *   2  hero           what, where, and what to do next
 *   3  problem        do they understand my situation
 *   4  solution       what do they do about it
 *   5  services       do they do the specific thing I need
 *   6  process        what happens if I call
 *   7  projects       can they actually do this
 *   8  testimonials   what do other people say
 *   9  FAQ            my remaining objections
 *  10  final CTA      right — how do I start
 *  11  footer         (in the layout)
 *
 * The credentials strip that used to sit between the hero and the problem is
 * gone: with the licence number, the insurer and the project count all still
 * unverified, it was four cells of bracketed tokens in the most valuable
 * space on the page. It comes back from git history the day those facts
 * exist.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Must match what <Faq> renders: the structured data may never claim an
  // answer the visible page does not show.
  const faqItems = homeFaq[locale]
    .map((item) => ({ q: item.q, a: fillOrNull(item.a) }))
    .filter((item): item is { q: string; a: string } => item.a !== null);

  return (
    <>
      <Hero locale={locale} />
      <Problem locale={locale} />
      <Solution locale={locale} />
      <ServicesOverview locale={locale} />
      <Process locale={locale} />
      <SelectedWork locale={locale} />
      <TestimonialsSection locale={locale} />
      <Faq locale={locale} />
      <AboutTeaser locale={locale} />
      <FinalCta locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqItems)) }}
      />
    </>
  );
}
