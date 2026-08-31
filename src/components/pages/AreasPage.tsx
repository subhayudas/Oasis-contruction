import Link from 'next/link';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FinalCta } from '@/components/sections/FinalCta';
import { IconArrow, IconPin } from '@/components/icons';
import { Eyebrow } from '@/components/ui';
import { areaGroups } from '@/content/areas';
import { getDictionary } from '@/content/dictionary';
import { fact, hasFact } from '@/content/placeholders';
import { services } from '@/content/services';
import type { Locale } from '@/lib/i18n';
import { pagePath, servicePath } from '@/lib/routes';

/**
 * One service-area page, not a page per municipality.
 *
 * A separate near-identical page for "pavé uni Blainville", "pavé uni
 * Rosemère" and so on is a doorway-page pattern: Google's own guidelines name
 * it, and it is exactly the sort of thing that gets a small contractor's site
 * demoted. This page lists the territory honestly, once, and links to the
 * services instead.
 */
export function AreasPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <>
      <section className="u-section-tight">
        <div className="u-wrap">
          <Breadcrumbs
            label={t.common.breadcrumb}
            className="mb-8"
            items={[
              { name: t.common.home, path: pagePath(locale, 'home') },
              { name: t.nav.areas, path: pagePath(locale, 'areas') },
            ]}
          />
          <Eyebrow>{t.areasPage.eyebrow}</Eyebrow>
          <span className="u-tick mt-3" aria-hidden="true" />
          <h1 className="u-display mt-6">{t.areasPage.title}</h1>
          <p className="u-lede mt-6 max-w-2xl">{t.areasPage.lede}</p>
          <p className="u-body mt-5 max-w-2xl">{t.areasPage.intro}</p>
        </div>
      </section>

      <section className="bg-sand u-section border-y border-[var(--line)]">
        <div className="u-wrap grid gap-10 md:grid-cols-2 lg:gap-14">
          {areaGroups.map((group, index) => (
            <div
              key={group.id}
              className="reveal"
              style={{ ['--reveal-delay' as string]: `${index * 80}ms` }}
            >
              <h2 className="u-h2 flex items-center gap-3">
                <IconPin className="text-brass-deep h-6 w-6 shrink-0" />
                {group.name[locale]}
              </h2>
              <p className="u-body mt-3">{group.note[locale]}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {group.places.map((place) => (
                  <li key={place} className="s-plaque px-3 py-2 text-[0.875rem]">
                    <span className="relative z-10">{place}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="u-section">
        <div className="u-wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="reveal lg:col-span-7">
            <h2 className="u-h2">{t.areasPage.whyLocalTitle}</h2>
            <p className="u-body mt-5 max-w-xl">{t.areasPage.whyLocalBody}</p>

            {/* Rendered only once the business supplies the exact territory
                wording — an empty section beats a bracketed one here, because
                this page is otherwise complete without it. */}
            {hasFact('serviceAreas') ? (
              <div className="mt-8">
                <h3 className="u-h3 text-[1.125rem]">{t.areasPage.detailTitle}</h3>
                <p className="u-body mt-3 max-w-xl">{fact('serviceAreas')}</p>
              </div>
            ) : null}
          </div>

          <nav aria-label={t.nav.services} className="reveal lg:col-span-5">
            <h2 className="u-label text-umber">{t.nav.services}</h2>
            <ul className="mt-4">
              {services.map((service) => (
                <li key={service.key} className="border-t border-[var(--line)]">
                  <Link
                    href={servicePath(locale, service.key)}
                    className="group flex min-h-14 items-center justify-between gap-4 py-3.5"
                  >
                    <span className="u-h3 text-[1rem]">{service.copy[locale].name}</span>
                    <IconArrow className="text-ink-50 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <FinalCta locale={locale} />
    </>
  );
}
