import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Picture } from '@/components/Picture';
import { ContactPanel } from '@/components/sections/ContactPanel';
import { ProcessSteps } from '@/components/sections/Process';
import { IconArrow, serviceIcons } from '@/components/icons';
import { ArrowLink, Eyebrow } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import { services } from '@/content/services';
import { isLocale, locales } from '@/lib/i18n';
import { source } from '@/lib/images';
import { alternatesForPage, pagePath, servicePath } from '@/lib/routes';
import { breadcrumbJsonLd, buildMetadata } from '@/lib/seo';

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
    title: t.meta.services.title,
    description: t.meta.services.description,
    path: pagePath(locale, 'services'),
    alternates: alternatesForPage('services'),
  });
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const crumbs = [
    { name: t.common.home, path: pagePath(locale, 'home') },
    { name: t.nav.services, path: pagePath(locale, 'services') },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />

      <section className="u-wrap pt-8 pb-4 lg:pt-12">
        <Breadcrumbs items={crumbs} label={t.common.breadcrumb} />
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Eyebrow>{t.servicesPage.eyebrow}</Eyebrow>
            <span className="u-tick mt-3.5" aria-hidden="true" />
            <h1 className="u-display mt-6 text-[clamp(2.25rem,5.6vw,4rem)]">
              {t.servicesPage.title}
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="u-lede">{t.servicesPage.lede}</p>
            <p className="u-body mt-4 text-[0.9375rem]">{t.servicesPage.intro}</p>
          </div>
        </div>
      </section>

      <section className="u-section-tight">
        <div className="u-wrap flex flex-col gap-px">
          {services.map((service, index) => {
            const copy = service.copy[locale];
            const Icon = serviceIcons[service.key];
            const scene = sceneById(service.hero);
            return (
              <article
                key={service.key}
                className="reveal group relative grid gap-6 border-t border-[var(--line-strong)] py-8 lg:grid-cols-12 lg:gap-10 lg:py-10"
                style={{ ['--reveal-delay' as string]: `${index * 60}ms` }}
              >
                <div className="flex items-start gap-5 lg:col-span-1">
                  <span
                    className="s-chip text-ink-80 flex h-12 w-12 shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                </div>

                <div className="lg:col-span-5">
                  <span className="u-label text-bronze text-[0.5625rem] tracking-[0.22em]">
                    {String(index + 1).padStart(2, '0')} · {copy.material}
                  </span>
                  <h2 className="u-h2 mt-3 text-[clamp(1.5rem,2.6vw,2.125rem)]">
                    <Link
                      href={servicePath(locale, service.key)}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {copy.name}
                    </Link>
                  </h2>
                  <p className="u-body mt-4 max-w-md">{copy.short}</p>
                  <span className="link-rule mt-6 inline-flex text-[0.9375rem]">
                    {t.common.learnMore}
                    <IconArrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>

                <div className="lg:col-span-6">
                  <div className="frame frame-keyline shadow-[0_2px_4px_rgba(12,26,43,0.06),0_26px_40px_-38px_rgba(12,26,43,0.8)]">
                    <Picture
                      alt={scene?.alt[locale] ?? ''}
                      sizes="(min-width: 1024px) 46vw, 100vw"
                      sources={[source(service.hero, 'wide')]}
                      imgClassName="w-full h-auto"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="s-sand u-section border-t border-[var(--line)]">
        <div className="u-wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Eyebrow>{t.processSection.eyebrow}</Eyebrow>
            <span className="u-tick mt-3.5" aria-hidden="true" />
            <h2 className="u-h2 mt-5">{t.processSection.title}</h2>
            <p className="u-lede mt-5">{t.processSection.lede}</p>
            <div className="s-plaque mt-8 px-5 py-4">
              <p className="u-h3 relative z-10">{t.servicesPage.ctaTitle}</p>
              <p className="u-body relative z-10 mt-2 text-[0.9375rem]">
                {t.servicesPage.ctaBody}
              </p>
              <ArrowLink href={pagePath(locale, 'contact')} className="relative z-10 mt-4">
                {t.common.quote}
              </ArrowLink>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ProcessSteps
              steps={t.processSection.steps}
              className="sm:grid-cols-2 lg:grid-cols-2 lg:gap-x-8"
            />
          </div>
        </div>
      </section>

      <ContactPanel locale={locale} />
    </>
  );
}
