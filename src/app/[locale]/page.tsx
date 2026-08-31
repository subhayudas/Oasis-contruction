import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { TrustBar } from '@/components/TrustBar';
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
import { fill } from '@/content/placeholders';
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
 *   3  trust bar      are these people real
 *   4  problem        do they understand my situation
 *   5  solution       what do they do about it
 *   6  services       do they do the specific thing I need
 *   7  process        what happens if I call
 *   8  projects       can they actually do this
 *   9  testimonials   what do other people say
 *  10  FAQ            my remaining objections
 *  11  final CTA      right — how do I start
 *  12  footer         (in the layout)
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const faqItems = homeFaq[locale].map((item) => ({ q: item.q, a: fill(item.a) }));

  return (
    <>
      <Hero locale={locale} />
      <TrustBar locale={locale} />
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
