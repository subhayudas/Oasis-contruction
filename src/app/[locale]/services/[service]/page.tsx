import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ServiceDiagram } from '@/components/Diagrams';
import { Picture } from '@/components/Picture';
import { QuoteForm } from '@/components/QuoteForm';
import { ProcessSteps } from '@/components/sections/Process';
import { IconArrow, serviceIcons } from '@/components/icons';
import { CheckList, Eyebrow, NoteCard } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import { serviceByKey, services } from '@/content/services';
import { site } from '@/content/site';
import { isLocale, locales } from '@/lib/i18n';
import { source } from '@/lib/images';
import {
  alternatesForService,
  pagePath,
  serviceKeyFromSlug,
  servicePath,
  serviceSlugs,
} from '@/lib/routes';
import { breadcrumbJsonLd, buildMetadata, serviceJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    Object.values(serviceSlugs).map((slugs) => ({ locale, service: slugs[locale] })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}): Promise<Metadata> {
  const { locale, service } = await params;
  if (!isLocale(locale)) return {};
  const key = serviceKeyFromSlug(locale, service);
  if (!key) return {};

  const t = getDictionary(locale);
  const copy = serviceByKey(key).copy[locale];
  void t;

  return buildMetadata({
    locale,
    title: copy.metaTitle,
    description: copy.metaDescription,
    path: servicePath(locale, key),
    alternates: alternatesForService(key),
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale, service: slug } = await params;
  if (!isLocale(locale)) notFound();
  const key = serviceKeyFromSlug(locale, slug);
  if (!key) notFound();

  const t = getDictionary(locale);
  const service = serviceByKey(key);
  const copy = service.copy[locale];
  const Icon = serviceIcons[key];
  const heroScene = sceneById(service.hero);
  const detailScene = sceneById(service.detail);

  const crumbs = [
    { name: t.common.home, path: pagePath(locale, 'home') },
    { name: t.nav.services, path: pagePath(locale, 'services') },
    { name: copy.name, path: servicePath(locale, key) },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbJsonLd(crumbs), serviceJsonLd(locale, key)]),
        }}
      />

      {/* ------------------------------------------------------------------ hero */}
      <section className="u-wrap pt-8 pb-4 lg:pt-12">
        <Breadcrumbs items={crumbs} label={t.common.breadcrumb} />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-4">
              <span
                className="s-chip text-ink-80 flex h-14 w-14 shrink-0 items-center justify-center"
                aria-hidden="true"
              >
                <Icon className="h-7 w-7" />
              </span>
              <div>
                <Eyebrow>{copy.eyebrow}</Eyebrow>
                <p className="u-label text-ink-50 mt-1.5 text-[0.5625rem] tracking-[0.2em]">
                  {copy.material}
                </p>
              </div>
            </div>

            <h1 className="u-display mt-8 text-[clamp(2.25rem,5.4vw,3.75rem)]">{copy.title}</h1>
            <p className="u-lede mt-6 max-w-xl">{copy.lede}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="#soumission" className="btn btn-stone rounded-sm">
                {t.common.quote}
              </Link>
              <a href={site.phone.href} className="btn btn-quarry rounded-sm">
                {site.phone.display}
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <figure>
              <div className="frame frame-keyline clip-notch-sm shadow-[0_2px_4px_rgba(12,26,43,0.07),0_36px_54px_-44px_rgba(12,26,43,0.85)]">
                <Picture
                  priority
                  alt={heroScene?.alt[locale] ?? ''}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  sources={[
                    source(service.hero, 'wide', '(min-width: 40rem)'),
                    source(service.hero, 'portrait'),
                  ]}
                  imgClassName="w-full h-auto"
                />
              </div>
              <figcaption className="u-meta mt-3">{heroScene?.caption[locale]}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- problem and approach */}
      <section className="u-section">
        <div className="u-wrap grid gap-10 border-t border-[var(--line-strong)] pt-10 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <h2 className="u-h2 text-[clamp(1.6rem,2.6vw,2.125rem)]">{copy.problemTitle}</h2>
            <div className="mt-5 flex flex-col gap-4">
              {copy.problem.map((paragraph) => (
                <p key={paragraph} className="u-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ ['--reveal-delay' as string]: '80ms' }}>
            <h2 className="u-h2 text-[clamp(1.6rem,2.6vw,2.125rem)]">{copy.approachTitle}</h2>
            <div className="mt-5 flex flex-col gap-4">
              {copy.approach.map((paragraph) => (
                <p key={paragraph} className="u-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- includes / surfaces / note */}
      <section className="s-sand u-section">
        <div className="u-wrap grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="reveal lg:col-span-5">
            <h2 className="u-h3 text-[1.25rem]">{copy.includesTitle}</h2>
            <p className="u-meta mt-2">{t.servicePage.includesNote}</p>
            <CheckList items={copy.includes} className="mt-5" />
          </div>

          <div
            className="reveal lg:col-span-3"
            style={{ ['--reveal-delay' as string]: '70ms' }}
          >
            <h2 className="u-h3 text-[1.25rem]">{copy.surfacesTitle}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {copy.surfaces.map((item) => (
                <li key={item} className="s-plaque px-3 py-2 text-[0.8125rem]">
                  <span className="relative z-10">{item}</span>
                </li>
              ))}
            </ul>
            <NoteCard label={t.servicePage.noteLabel} className="mt-7">
              {copy.note}
            </NoteCard>
          </div>

          <figure
            className="reveal lg:col-span-4"
            style={{ ['--reveal-delay' as string]: '140ms' }}
          >
            <div className="frame frame-keyline shadow-[0_2px_4px_rgba(12,26,43,0.07),0_30px_44px_-40px_rgba(12,26,43,0.85)]">
              <Picture
                alt={detailScene?.alt[locale] ?? ''}
                sizes="(min-width: 1024px) 32vw, 100vw"
                sources={[source(service.detail, 'portrait')]}
                imgClassName="w-full h-auto"
              />
            </div>
            <figcaption className="u-meta mt-3">{detailScene?.caption[locale]}</figcaption>
          </figure>
        </div>
      </section>

      {/* ------------------------------------------------------------- diagram */}
      {service.diagram ? (
        <section className="u-section-tight">
          <div className="u-wrap">
            <figure className="reveal s-plaque overflow-hidden p-6 sm:p-8">
              <div className="relative z-10 overflow-x-auto">
                <div className="min-w-[34rem]">
                  <ServiceDiagram kind={service.diagram} locale={locale} />
                </div>
              </div>
              <figcaption className="u-meta relative z-10 mt-5 max-w-2xl">
                {t.servicePage.diagramCaption[service.diagram]}
              </figcaption>
            </figure>
          </div>
        </section>
      ) : null}

      {/* -------------------------------------------------------------- process */}
      <section className="u-section">
        <div className="u-wrap">
          <h2 className="u-h2 text-[clamp(1.6rem,2.6vw,2.125rem)]">
            {t.servicePage.processTitle}
          </h2>
          <ProcessSteps steps={copy.process} className="mt-10 lg:gap-x-7" />
        </div>
      </section>

      {/* ------------------------------------------------------- local + related */}
      <section className="u-section-tight">
        <div className="u-wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="reveal lg:col-span-7">
            <h2 className="u-h3 text-[1.25rem]">{copy.localTitle}</h2>
            <p className="u-body mt-4 max-w-xl">{copy.local}</p>
          </div>

          <div className="reveal lg:col-span-5">
            <h2 className="u-label text-bronze">{t.servicePage.relatedTitle}</h2>
            <ul className="mt-4 flex flex-col">
              {service.related.map((relatedKey) => {
                const related = services.find((s) => s.key === relatedKey);
                if (!related) return null;
                return (
                  <li key={relatedKey} className="border-t border-[var(--line)]">
                    <Link
                      href={servicePath(locale, relatedKey)}
                      className="group flex min-h-14 items-center justify-between gap-4 py-3.5"
                    >
                      <span>
                        <span className="u-h3 block text-[1.0625rem]">
                          {related.copy[locale].name}
                        </span>
                        <span className="u-meta mt-1 block max-w-sm">
                          {related.copy[locale].short}
                        </span>
                      </span>
                      <IconArrow className="text-ink-50 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-[var(--line)] pt-4">
                <Link
                  href={pagePath(locale, 'services')}
                  className="link-rule text-[0.9375rem]"
                >
                  {t.servicePage.backToServices}
                  <IconArrow className="h-4 w-4" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- quote CTA */}
      <section id="soumission" className="s-ink on-ink">
        <div className="grain-overlay">
          <div className="u-wrap u-section grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow tone="teal">{t.contactPanel.eyebrow}</Eyebrow>
              <span className="u-tick mt-3.5" aria-hidden="true" />
              <h2 className="u-h2 text-paper mt-5 text-[clamp(1.6rem,2.8vw,2.25rem)]">
                {t.servicePage.ctaTitle}
              </h2>
              <p className="text-dust mt-5 max-w-md text-[1.0625rem] leading-[1.68]">
                {t.servicePage.ctaBody}
              </p>
              <p className="mt-8">
                <a
                  href={site.phone.href}
                  className="text-paper hover:text-teal inline-flex min-h-11 items-center gap-2.5 text-[1.25rem] font-[550] transition-colors"
                >
                  {site.phone.display}
                </a>
              </p>
              <p className="text-dust-2 mt-1 text-[0.9375rem]">
                {locale === 'fr' ? site.hours.displayFr : site.hours.displayEn}
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="s-plaque clip-notch-sm p-6 sm:p-8">
                <div className="relative z-10">
                  <QuoteForm
                    locale={locale}
                    variant="full"
                    defaultService={key}
                    serviceOptions={services.map((s) => ({
                      value: s.key,
                      label: s.copy[locale].name,
                    }))}
                    privacyHref={pagePath(locale, 'privacy')}
                    phone={{ href: site.phone.href, display: site.phone.display }}
                    email={{ href: site.email.href, display: site.email.display }}
                    labels={t.form}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
