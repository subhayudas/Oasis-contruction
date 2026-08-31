import Link from 'next/link';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ServiceDiagram } from '@/components/Diagrams';
import { FaqAccordion } from '@/components/FaqAccordion';
import { Picture } from '@/components/Picture';
import { ProjectCard } from '@/components/ProjectCard';
import { TestimonialGrid } from '@/components/Testimonials';
import { OpenGuidedForm } from '@/components/guided/OpenGuidedForm';
import { IconArrow, IconCamera, IconCheck, IconPhone, serviceIcons } from '@/components/icons';
import { ProcessSteps } from '@/components/sections/Process';
import { FinalCta } from '@/components/sections/FinalCta';
import { CheckList, Eyebrow, NoteCard } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { fillOrNull } from '@/content/placeholders';
import { projectEntries } from '@/content/projects';
import { services } from '@/content/services';
import { sceneById } from '@/content/imagery';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath, servicePath, type ServiceKey } from '@/lib/routes';

/**
 * The service-page template, in the order the brief lays out:
 *
 *   hero → symptoms → causes → solution → what's included → diagram →
 *   process → projects → testimonials → price factors → FAQ → warranty →
 *   service area → related services → final CTA
 *
 * Three calls to action are spread through it: one in the hero, one after the
 * price section (the moment a visitor decides the number is unknowable without
 * a visit), and the panel at the end.
 */
export function ServicePage({
  locale,
  serviceKey,
}: {
  locale: Locale;
  serviceKey: ServiceKey;
}) {
  const t = getDictionary(locale);
  const service = services.find((s) => s.key === serviceKey);
  if (!service) return null;

  const copy = service.copy[locale];
  const Icon = serviceIcons[service.key];
  const heroScene = sceneById(service.hero);
  const detailScene = sceneById(service.detail);

  // Only projects that actually carry this service's tag. An empty result
  // renders nothing rather than a grid of unrelated photographs.
  const related = projectEntries.filter((entry) => entry.tags.includes(serviceKey)).slice(0, 3);

  const faqItems = copy.faq
    .map((item) => ({ q: item.q, a: fillOrNull(item.a) }))
    .filter((item): item is { q: string; a: string } => item.a !== null);
  const warranty = fillOrNull(copy.warranty);

  return (
    <>
      {/* ----------------------------------------------------------------- hero */}
      <section className="u-section-tight">
        <div className="u-wrap">
          <Breadcrumbs
            label={t.common.breadcrumb}
            className="mb-8"
            items={[
              { name: t.common.home, path: pagePath(locale, 'home') },
              { name: t.nav.services, path: pagePath(locale, 'services') },
              { name: copy.name, path: servicePath(locale, serviceKey) },
            ]}
          />

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
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

              <h1 className="u-display mt-8">{copy.title}</h1>
              <p className="u-lede mt-6 max-w-xl">{copy.lede}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="#devis"
                  data-cta={t.common.quote}
                  data-cta-location={`service-hero-${serviceKey}`}
                  className="btn btn-stone"
                >
                  {t.common.quote}
                </Link>
                {service.photoFirst ? (
                  <OpenGuidedForm
                    href={pagePath(locale, 'photo')}
                    label={t.common.photoCta}
                    location={`service-hero-${serviceKey}`}
                    service={serviceKey}
                    className="btn btn-quarry"
                  >
                    <IconCamera className="h-4.5 w-4.5" />
                  </OpenGuidedForm>
                ) : (
                  <a
                    href={site.phone.href}
                    data-cta={t.common.call}
                    data-cta-location={`service-hero-${serviceKey}`}
                    className="btn btn-quarry"
                  >
                    <IconPhone className="h-4.5 w-4.5" />
                    {site.phone.display}
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              <figure>
                <div className="frame frame-keyline shadow-[0_2px_4px_rgba(26,22,16,0.07),0_36px_54px_-44px_rgba(26,22,16,0.85)]">
                  <Picture
                    priority
                    alt={heroScene?.alt[locale] ?? copy.name}
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
        </div>
      </section>

      {/* --------------------------------------------- symptoms → causes → fix */}
      <section className="bg-sand u-section border-y border-[var(--line)]">
        <div className="u-wrap">
          <div className="reveal mx-auto max-w-[46rem] text-center">
            <h2 className="u-h2">{copy.symptomsTitle}</h2>
            <p className="u-lede mt-5">{copy.symptoms}</p>
          </div>

          <div className="mt-14 grid gap-10 border-t border-[var(--line-strong)] pt-12 lg:grid-cols-2 lg:gap-16">
            <div className="reveal">
              <h2 className="u-h3 text-[1.25rem]">{copy.causesTitle}</h2>
              <div className="mt-5 flex flex-col gap-4">
                {copy.causes.map((paragraph) => (
                  <p key={paragraph} className="u-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="reveal" style={{ ['--reveal-delay' as string]: '80ms' }}>
              <h2 className="u-h3 text-[1.25rem]">{copy.solutionTitle}</h2>
              <div className="mt-5 flex flex-col gap-4">
                {copy.solution.map((paragraph) => (
                  <p key={paragraph} className="u-body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- includes / surfaces / note */}
      <section className="u-section">
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
            <div className="frame frame-keyline shadow-[0_2px_4px_rgba(26,22,16,0.07),0_30px_44px_-40px_rgba(26,22,16,0.85)]">
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
          <h2 className="u-h2">{t.servicePage.processTitle}</h2>
          <ProcessSteps steps={copy.process} className="mt-10 lg:grid-cols-3 lg:gap-x-7" />
        </div>
      </section>

      {/* ------------------------------------------------------------- projects */}
      {related.length > 0 ? (
        <section className="bg-sand u-section border-y border-[var(--line)]">
          <div className="u-wrap">
            <div className="reveal flex flex-wrap items-end justify-between gap-6">
              <h2 className="u-h2">{t.workSection.title}</h2>
              <Link href={pagePath(locale, 'projects')} className="link-rule text-[0.9375rem]">
                {t.common.allProjects}
                <IconArrow className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {related.map((entry, index) => (
                <li
                  key={entry.id}
                  className="reveal"
                  style={{ ['--reveal-delay' as string]: `${index * 60}ms` }}
                >
                  <ProjectCard entry={entry} locale={locale} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* --------------------------------------------------------- testimonials */}
      <section className="u-section-tight">
        <div className="u-wrap">
          <h2 className="u-h2 reveal">{t.testimonialsSection.title}</h2>
          <TestimonialGrid locale={locale} className="mt-8 lg:grid-cols-2" />
        </div>
      </section>

      {/* ----------------------------------------------------- price + warranty */}
      <section className="u-section">
        <div className="u-wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="reveal lg:col-span-7">
            <h2 className="u-h2">{copy.priceTitle}</h2>
            <p className="u-body mt-5 max-w-xl">{copy.priceLede}</p>
            <ul className="mt-6 flex max-w-xl flex-col">
              {copy.priceFactors.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-b border-[var(--line)] py-3.5 last:border-b-0"
                >
                  <IconCheck className="text-brass-deep mt-0.5 h-5 w-5 shrink-0" />
                  <span className="u-body text-[0.9375rem]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="u-lede mt-7 max-w-xl">{copy.priceNote}</p>
            <div className="mt-8">
              <Link
                href="#devis"
                data-cta={t.common.quote}
                data-cta-location={`service-price-${serviceKey}`}
                className="btn btn-stone"
              >
                {t.common.quote}
              </Link>
            </div>
          </div>

          <div className="reveal lg:col-span-5">
            <div className="s-plaque px-6 py-6">
              <div className="relative z-10">
                {warranty ? (
                  <>
                    <h2 className="u-h3 text-[1.125rem]">{copy.warrantyTitle}</h2>
                    <p className="u-body mt-3 text-[0.9375rem]">{warranty}</p>
                  </>
                ) : null}

                <h2 className={`u-h3 text-[1.125rem] ${warranty ? 'mt-8' : ''}`}>
                  {t.servicePage.areaTitle}
                </h2>
                <p className="u-body mt-3 text-[0.9375rem]">{copy.local}</p>
                <Link
                  href={pagePath(locale, 'areas')}
                  className="link-rule mt-4 text-[0.875rem]"
                >
                  {t.nav.areas}
                  <IconArrow className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ FAQ */}
      <section className="bg-sand u-section border-y border-[var(--line)]">
        <div className="u-wrap">
          <h2 className="u-h2 reveal">{copy.faqTitle}</h2>
          <div className="reveal mt-8 max-w-[52rem]">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ related services */}
      <section className="u-section-tight">
        <div className="u-wrap">
          <h2 className="u-label text-umber">{t.servicePage.relatedTitle}</h2>
          <ul className="mt-4 max-w-3xl">
            {service.related.map((relatedKey) => {
              const item = services.find((s) => s.key === relatedKey);
              if (!item) return null;
              return (
                <li key={relatedKey} className="border-t border-[var(--line)]">
                  <Link
                    href={servicePath(locale, relatedKey)}
                    className="group flex min-h-14 items-center justify-between gap-4 py-3.5"
                  >
                    <span>
                      <span className="u-h3 block text-[1.0625rem]">
                        {item.copy[locale].name}
                      </span>
                      <span className="u-meta mt-1 block max-w-sm">
                        {item.copy[locale].short}
                      </span>
                    </span>
                    <IconArrow className="text-ink-50 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
            <li className="border-t border-[var(--line)] pt-4">
              <Link href={pagePath(locale, 'services')} className="link-rule text-[0.9375rem]">
                {t.servicePage.backToServices}
                <IconArrow className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <FinalCta locale={locale} defaultService={serviceKey} />
    </>
  );
}
