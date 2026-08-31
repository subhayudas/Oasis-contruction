import { BeforeAfter } from '@/components/BeforeAfter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProjectFilters } from '@/components/ProjectFilters';
import { FinalCta } from '@/components/sections/FinalCta';
import { Eyebrow } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { beforeAfters, projectEntries } from '@/content/projects';
import { services } from '@/content/services';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath, type ServiceKey } from '@/lib/routes';

export function ProjectsPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  // Only offer a filter for a service that actually has a project behind it —
  // a chip that yields an empty grid reads as a broken site.
  const used = new Set(projectEntries.flatMap((entry) => entry.tags));
  const filters = [
    { value: 'all' as const, label: t.projectsPage.filterAll },
    ...services
      .filter((service) => used.has(service.key))
      .map((service) => ({
        value: service.key as ServiceKey,
        label: service.copy[locale].name,
      })),
  ];

  return (
    <>
      <section className="u-section-tight pb-0">
        <div className="u-wrap">
          <Breadcrumbs
            label={t.common.breadcrumb}
            className="mb-8"
            items={[
              { name: t.common.home, path: pagePath(locale, 'home') },
              { name: t.nav.projects, path: pagePath(locale, 'projects') },
            ]}
          />
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Eyebrow>{t.projectsPage.eyebrow}</Eyebrow>
              <span className="u-tick mt-3.5" aria-hidden="true" />
              <h1 className="u-display mt-6">{t.projectsPage.title}</h1>
            </div>
            <div className="lg:col-span-5 lg:pt-4">
              <p className="u-lede">{t.projectsPage.lede}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- before / after */}
      <section className="u-section">
        <div className="u-wrap border-t border-[var(--line-strong)] pt-10">
          <h2 className="u-h2">{t.projectsPage.beforeAfterTitle}</h2>
          <p className="u-lede mt-4 max-w-xl">{t.projectsPage.beforeAfterLede}</p>

          <div className="mt-10 flex flex-col gap-14">
            {beforeAfters.map((item) => (
              <div key={item.id} className="reveal grid gap-8 lg:grid-cols-12 lg:gap-12">
                <BeforeAfter
                  className="lg:col-span-7"
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  before={{
                    sources: [source(item.before, 'still')],
                    alt: item.altBefore[locale],
                  }}
                  after={{
                    sources: [source(item.after, 'still')],
                    alt: item.altAfter[locale],
                  }}
                  labels={{
                    before: t.common.before,
                    after: t.common.after,
                    control: t.workSection.sliderLabel,
                    help: t.workSection.sliderHelp,
                    valueText: t.workSection.sliderValue,
                  }}
                />
                <div className="lg:col-span-5">
                  <h3 className="u-h3">{item.title[locale]}</h3>
                  <p className="u-body mt-4">{item.caption[locale]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- gallery */}
      <section className="bg-sand u-section border-y border-[var(--line)]">
        <div className="u-wrap">
          <h2 className="u-h2">{t.projectsPage.galleryTitle}</h2>
          <div className="mt-8">
            <ProjectFilters
              entries={projectEntries}
              locale={locale}
              filters={filters}
              labels={{
                legend: t.projectsPage.filterLabel,
                empty: t.projectsPage.filterEmpty,
                count: t.projectsPage.countLabel,
              }}
            />
          </div>
        </div>
      </section>

      <FinalCta locale={locale} />
    </>
  );
}
