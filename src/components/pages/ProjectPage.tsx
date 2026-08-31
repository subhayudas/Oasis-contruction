import Link from 'next/link';

import { BeforeAfter } from '@/components/BeforeAfter';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Picture } from '@/components/Picture';
import { IconArrow } from '@/components/icons';
import { FinalCta } from '@/components/sections/FinalCta';
import { Eyebrow, NoteCard } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { type ProjectEntry } from '@/content/projects';
import { services } from '@/content/services';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath, projectPath, servicePath } from '@/lib/routes';

/**
 * A project detail page.
 *
 * The layout has slots for everything the brief asks for — location, duration,
 * the problem, the solution, the scope — but a slot only renders when the
 * business has actually supplied that fact. Where they have not, one labelled
 * note says so once, rather than a page of confident sentences reverse
 * engineered from a photograph.
 */
export function ProjectPage({ locale, entry }: { locale: Locale; entry: ProjectEntry }) {
  const t = getDictionary(locale);

  const facts = [
    entry.location
      ? { label: t.projectPage.locationLabel, value: entry.location[locale] }
      : null,
    {
      label: t.projectPage.serviceLabel,
      value: entry.tags
        .map((key) => services.find((s) => s.key === key)?.copy[locale].name ?? key)
        .join(' · '),
    },
    entry.completedAt
      ? { label: t.projectPage.completedLabel, value: entry.completedAt[locale] }
      : null,
    entry.duration
      ? { label: t.projectPage.durationLabel, value: entry.duration[locale] }
      : null,
  ].filter((item): item is { label: string; value: string } => item !== null);

  const hasNarrative = Boolean(entry.problem || entry.solution || entry.scope);

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
              { name: entry.title[locale], path: projectPath(locale, entry.id) },
            ]}
          />
          <Eyebrow>{t.projectsPage.eyebrow}</Eyebrow>
          <span className="u-tick mt-3" aria-hidden="true" />
          <h1 className="u-display mt-6 max-w-3xl">{entry.title[locale]}</h1>

          <dl className="mt-9 grid gap-px border-t border-[var(--line-strong)] sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((item, index) => (
              <div
                key={item.label}
                className={`flex flex-col gap-1.5 py-4 ${
                  index > 0
                    ? 'border-t border-[var(--line)] sm:border-t-0 lg:border-l lg:pl-6'
                    : ''
                }`}
              >
                <dt className="u-label text-ink-50 text-[0.5625rem] tracking-[0.2em]">
                  {item.label}
                </dt>
                <dd className="text-ink text-[0.9375rem] font-[550]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------ the frame */}
      <section className="u-section">
        <div className="u-wrap">
          {entry.kind === 'before-after' ? (
            <BeforeAfter
              sizes="(min-width: 1024px) 78vw, 100vw"
              before={{
                sources: [source(entry.before, 'still')],
                alt: entry.altBefore[locale],
              }}
              after={{
                sources: [source(entry.after, 'still')],
                alt: entry.altAfter[locale],
              }}
              labels={{
                before: t.common.before,
                after: t.common.after,
                control: t.workSection.sliderLabel,
                help: t.workSection.sliderHelp,
                valueText: t.workSection.sliderValue,
              }}
            />
          ) : (
            <figure className="reveal">
              <div className="frame frame-keyline shadow-[0_2px_4px_rgba(26,22,16,0.07),0_40px_60px_-46px_rgba(26,22,16,0.85)]">
                <Picture
                  priority
                  alt={entry.alt[locale]}
                  sizes="(min-width: 1024px) 78vw, 100vw"
                  sources={[
                    source(entry.image, 'wide', '(min-width: 40rem)'),
                    source(entry.image, 'portrait'),
                  ]}
                  imgClassName="w-full h-auto"
                />
              </div>
            </figure>
          )}

          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <h2 className="u-h3 text-[1.25rem]">{t.projectPage.whatYouSeeTitle}</h2>
              <p className="u-body mt-4">{entry.caption[locale]}</p>

              {entry.problem ? (
                <>
                  <h2 className="u-h3 mt-10 text-[1.25rem]">{t.projectPage.problemTitle}</h2>
                  <p className="u-body mt-4">{entry.problem[locale]}</p>
                </>
              ) : null}

              {entry.solution ? (
                <>
                  <h2 className="u-h3 mt-10 text-[1.25rem]">{t.projectPage.solutionTitle}</h2>
                  <p className="u-body mt-4">{entry.solution[locale]}</p>
                </>
              ) : null}

              {entry.scope ? (
                <>
                  <h2 className="u-h3 mt-10 text-[1.25rem]">{t.projectPage.scopeTitle}</h2>
                  <p className="u-body mt-4">{entry.scope[locale]}</p>
                </>
              ) : null}

              {!hasNarrative ? (
                <NoteCard label={t.projectPage.pendingLabel} className="mt-8 max-w-xl">
                  {t.projectPage.pendingBody}
                </NoteCard>
              ) : null}
            </div>

            <nav aria-label={t.nav.services} className="lg:col-span-5">
              <h2 className="u-label text-umber">{t.nav.services}</h2>
              <ul className="mt-4">
                {entry.tags.map((key) => {
                  const service = services.find((s) => s.key === key);
                  if (!service) return null;
                  return (
                    <li key={key} className="border-t border-[var(--line)]">
                      <Link
                        href={servicePath(locale, key)}
                        className="group flex min-h-14 items-center justify-between gap-4 py-3.5"
                      >
                        <span>
                          <span className="u-h3 block text-[1rem]">
                            {service.copy[locale].name}
                          </span>
                          <span className="u-meta mt-1 block">
                            {service.copy[locale].short}
                          </span>
                        </span>
                        <IconArrow className="text-ink-50 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </li>
                  );
                })}
                <li className="border-t border-[var(--line)] pt-4">
                  <Link
                    href={pagePath(locale, 'projects')}
                    className="link-rule text-[0.9375rem]"
                  >
                    {t.projectPage.backToProjects}
                    <IconArrow className="h-4 w-4" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <FinalCta locale={locale} defaultService={entry.tags[0]} />
    </>
  );
}
