import Link from 'next/link';

import { BeforeAfter } from '@/components/BeforeAfter';
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs';
import { Picture } from '@/components/Picture';
import { ContactPanel } from '@/components/sections/ContactPanel';
import { Eyebrow } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { beforeAfters, projects } from '@/content/projects';
import { services } from '@/content/services';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath, servicePath } from '@/lib/routes';

/** A repeating 3-2-3 rhythm so the grid never reads as a uniform card wall. */
const SPANS = ['lg:col-span-7', 'lg:col-span-5', 'lg:col-span-5', 'lg:col-span-7'];

export function ProjectsPage({ locale, crumbs }: { locale: Locale; crumbs: Crumb[] }) {
  const t = getDictionary(locale);
  const [featured, ...rest] = beforeAfters;

  return (
    <>
      <section className="u-wrap pt-8 pb-4 lg:pt-12">
        <Breadcrumbs items={crumbs} label={t.common.breadcrumb} />
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Eyebrow>{t.projectsPage.eyebrow}</Eyebrow>
            <span className="u-tick mt-3.5" aria-hidden="true" />
            <h1 className="u-display mt-6 text-[clamp(2.25rem,5.6vw,4rem)]">
              {t.projectsPage.title}
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="u-lede">{t.projectsPage.lede}</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- before / after */}
      <section className="u-section-tight">
        <div className="u-wrap border-t border-[var(--line-strong)] pt-10">
          <h2 className="u-h2 text-[clamp(1.6rem,2.8vw,2.25rem)]">
            {t.projectsPage.beforeAfterTitle}
          </h2>
          <p className="u-lede mt-4 max-w-xl">{t.projectsPage.beforeAfterLede}</p>

          {featured ? (
            <div className="reveal mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
              <BeforeAfter
                className="lg:col-span-7"
                sizes="(min-width: 1024px) 56vw, 100vw"
                before={{
                  sources: [source(featured.before, 'still')],
                  alt: featured.altBefore[locale],
                }}
                after={{
                  sources: [source(featured.after, 'still')],
                  alt: featured.altAfter[locale],
                }}
                labels={{
                  before: t.common.before,
                  after: t.common.after,
                  control: t.workSection.sliderLabel,
                  help: t.workSection.sliderHelp,
                  valueText: t.workSection.sliderValue,
                }}
              />
              <div className="lg:col-span-5 lg:pt-6">
                <h3 className="u-h3 text-[clamp(1.25rem,2vw,1.625rem)]">
                  {featured.title[locale]}
                </h3>
                <p className="u-body mt-4">{featured.caption[locale]}</p>
              </div>
            </div>
          ) : null}

          {/* The second pair was shot from different distances, so it is shown
              as a labelled diptych rather than forced into a comparator. */}
          {rest.map((pair) => (
            <div key={pair.id} className="reveal mt-14 border-t border-[var(--line)] pt-10">
              <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4 lg:pt-2">
                  <h3 className="u-h3 text-[clamp(1.25rem,2vw,1.625rem)]">
                    {pair.title[locale]}
                  </h3>
                  <p className="u-body mt-4">{pair.caption[locale]}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:gap-5">
                  {(
                    [
                      { id: pair.before, label: t.common.before, alt: pair.altBefore[locale] },
                      { id: pair.after, label: t.common.after, alt: pair.altAfter[locale] },
                    ] as const
                  ).map((panel) => (
                    <figure key={panel.id} className="relative">
                      <div className="frame frame-keyline shadow-[0_2px_4px_rgba(12,26,43,0.06),0_26px_40px_-38px_rgba(12,26,43,0.8)]">
                        <Picture
                          alt={panel.alt}
                          sizes="(min-width: 1024px) 30vw, (min-width: 40rem) 46vw, 100vw"
                          sources={[source(panel.id, 'still')]}
                          imgClassName="w-full h-auto"
                        />
                      </div>
                      <figcaption className="s-plaque u-label text-ink-70 absolute top-3 left-3 px-2.5 py-1.5">
                        <span className="relative z-10">{panel.label}</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- gallery */}
      <section className="s-sand u-section">
        <div className="u-wrap">
          <h2 className="u-h2 text-[clamp(1.6rem,2.8vw,2.25rem)]">
            {t.projectsPage.galleryTitle}
          </h2>

          <ul className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-7">
            {projects.map((project, index) => {
              const span = SPANS[index % SPANS.length];
              const wide = span === 'lg:col-span-7';
              return (
                <li
                  key={project.id}
                  className={`reveal ${span}`}
                  style={{ ['--reveal-delay' as string]: `${(index % 2) * 70}ms` }}
                >
                  <figure>
                    <div
                      className={`frame frame-keyline ${
                        index === 0 ? 'clip-notch-sm' : ''
                      } shadow-[0_2px_4px_rgba(12,26,43,0.06),0_28px_44px_-40px_rgba(12,26,43,0.8)]`}
                    >
                      <Picture
                        alt={project.alt[locale]}
                        sizes={
                          wide
                            ? '(min-width: 1024px) 56vw, 100vw'
                            : '(min-width: 1024px) 40vw, 100vw'
                        }
                        sources={
                          wide
                            ? [
                                source(project.image, 'wide', '(min-width: 40rem)'),
                                source(project.image, 'portrait'),
                              ]
                            : [
                                source(project.image, 'portrait', '(min-width: 64rem)'),
                                source(project.image, 'wide'),
                              ]
                        }
                        imgClassName="w-full h-auto"
                      />
                    </div>
                    <figcaption className="mt-4">
                      <span className="u-h3 block font-[560]">{project.title[locale]}</span>
                      <span className="u-meta mt-1.5 block max-w-lg">
                        {project.caption[locale]}
                      </span>
                      <span className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => {
                          const service = services.find((s) => s.key === tag);
                          if (!service) return null;
                          return (
                            <Link
                              key={tag}
                              href={servicePath(locale, tag)}
                              className="u-label s-plaque text-ink-70 hover:text-ink inline-flex min-h-8 items-center px-2.5 py-1 text-[0.5625rem] tracking-[0.16em] transition-colors"
                            >
                              <span className="relative z-10">{service.copy[locale].name}</span>
                            </Link>
                          );
                        })}
                      </span>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <ContactPanel locale={locale} />
    </>
  );
}
