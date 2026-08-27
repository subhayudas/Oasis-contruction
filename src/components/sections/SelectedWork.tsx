import { BeforeAfter } from '@/components/BeforeAfter';
import { Picture } from '@/components/Picture';
import { ArrowLink, SectionHeading } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { beforeAfters, projectById } from '@/content/projects';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath } from '@/lib/routes';

/**
 * Three visual stories in an asymmetric grid: one paver walkway, one retaining
 * wall, and the client's own before/after frame driving the comparator.
 */
export function SelectedWork({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const walkway = projectById('palier-pave-uni-entree');
  const wall = projectById('muret-stationnement-pave');
  const transformation = beforeAfters[0];

  return (
    <section className="s-sand u-section border-t border-[var(--line)]">
      <div className="u-wrap">
        <SectionHeading
          eyebrow={t.workSection.eyebrow}
          title={t.workSection.title}
          lede={t.workSection.lede}
          action={
            <ArrowLink href={pagePath(locale, 'projects')}>{t.common.allProjects}</ArrowLink>
          }
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-7">
          {/* Lead story — the wall and driveway, wide. */}
          <figure className="reveal lg:col-span-7">
            <div className="frame frame-keyline clip-notch-sm shadow-[0_2px_4px_rgba(12,26,43,0.07),0_34px_50px_-44px_rgba(12,26,43,0.8)]">
              <Picture
                alt={wall?.alt[locale] ?? ''}
                sizes="(min-width: 1024px) 56vw, 100vw"
                sources={[
                  source('muret-stationnement-pave', 'wide', '(min-width: 40rem)'),
                  source('muret-stationnement-pave', 'portrait'),
                ]}
                imgClassName="w-full h-auto"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="u-h3 font-[560]">{wall?.title[locale]}</span>
              <span className="u-meta max-w-md">{wall?.caption[locale]}</span>
            </figcaption>
          </figure>

          {/* Companion story — the entrance landing, tall. */}
          <figure
            className="reveal lg:col-span-5"
            style={{ ['--reveal-delay' as string]: '80ms' }}
          >
            <div className="frame frame-keyline shadow-[0_2px_4px_rgba(12,26,43,0.07),0_34px_50px_-44px_rgba(12,26,43,0.8)]">
              <Picture
                alt={walkway?.alt[locale] ?? ''}
                sizes="(min-width: 1024px) 40vw, 100vw"
                sources={[
                  source('palier-pave-uni-entree', 'portrait', '(min-width: 64rem)'),
                  source('palier-pave-uni-entree', 'wide'),
                ]}
                imgClassName="w-full h-auto"
              />
            </div>
            <figcaption className="mt-4">
              <span className="u-h3 block font-[560]">{walkway?.title[locale]}</span>
              <span className="u-meta mt-1 block">{walkway?.caption[locale]}</span>
            </figcaption>
          </figure>

          {/* Before/after — the client's own combined frame, split and compared. */}
          {transformation ? (
            <div className="reveal lg:col-span-12">
              <div className="mt-4 grid gap-8 border-t border-[var(--line)] pt-10 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4">
                  <p className="u-label text-bronze">{t.projectsPage.beforeAfterTitle}</p>
                  <h3 className="u-h3 mt-4 text-[clamp(1.35rem,2vw,1.75rem)]">
                    {transformation.title[locale]}
                  </h3>
                  <p className="u-body mt-4 text-[0.9375rem]">
                    {transformation.caption[locale]}
                  </p>
                  <ArrowLink href={pagePath(locale, 'projects')} className="mt-6">
                    {t.common.allProjects}
                  </ArrowLink>
                </div>

                <BeforeAfter
                  className="lg:col-span-8"
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  before={{
                    sources: [source(transformation.before, 'still')],
                    alt: transformation.altBefore[locale],
                  }}
                  after={{
                    sources: [source(transformation.after, 'still')],
                    alt: transformation.altAfter[locale],
                  }}
                  labels={{
                    before: t.common.before,
                    after: t.common.after,
                    control: t.workSection.sliderLabel,
                    help: t.workSection.sliderHelp,
                    valueText: t.workSection.sliderValue,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
