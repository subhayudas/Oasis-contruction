import Link from 'next/link';

import { Picture } from '@/components/Picture';
import { IconArrow, serviceIcons } from '@/components/icons';
import { ArrowLink, SectionHeading } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import { services } from '@/content/services';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath, servicePath } from '@/lib/routes';

/**
 * Six cut samples on a board. Each tile is one clickable card with a single
 * link - the whole surface is the target, but only the heading is the anchor,
 * which keeps the accessibility tree clean.
 *
 * The square frame at the head of each card shows the trade rather than a
 * particular job; the icon chip rides its lower edge so the card still reads
 * as a mounted sample and not as a stock-photo tile.
 */
export function ServicesOverview({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="u-section">
      <div className="u-wrap">
        <SectionHeading
          eyebrow={t.servicesSection.eyebrow}
          title={t.servicesSection.title}
          lede={t.servicesSection.lede}
          action={
            <ArrowLink href={pagePath(locale, 'services')}>{t.common.allServices}</ArrowLink>
          }
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {services.map((service, index) => {
            const copy = service.copy[locale];
            const Icon = serviceIcons[service.key];
            const scene = sceneById(service.hero);
            return (
              <li
                key={service.key}
                className="reveal"
                style={{ ['--reveal-delay' as string]: `${index * 60}ms` }}
              >
                <div className="s-sample group relative flex h-full flex-col">
                  <div className="relative">
                    <div className="frame frame-keyline aspect-square">
                      <Picture
                        alt={scene?.alt[locale] ?? ''}
                        sizes="(min-width: 64rem) 30vw, (min-width: 40rem) 46vw, 92vw"
                        sources={[source(service.hero, 'square')]}
                        imgClassName="h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-material)] group-hover:scale-[1.03]"
                        className="block h-full w-full"
                      />
                    </div>
                    <span
                      className="u-label s-plaque absolute top-3 right-3 px-2 py-1 text-[0.5625rem] tracking-[0.2em]"
                      aria-hidden="true"
                    >
                      <span className="relative z-10">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <span
                      className="s-chip text-ink-80 absolute -bottom-6 left-5 flex h-12 w-12 shrink-0 items-center justify-center lg:left-6"
                      aria-hidden="true"
                    >
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5 pt-9 lg:p-6 lg:pt-10">
                    <h3 className="u-h3">
                      <Link
                        href={servicePath(locale, service.key)}
                        className="after:absolute after:inset-0 after:content-['']"
                      >
                        {copy.name}
                      </Link>
                    </h3>

                    <p className="u-body mt-3 text-[0.9375rem]">{copy.short}</p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                      <span className="text-brass-deep text-[0.8125rem] font-[600]">
                        {t.common.learnMore}
                      </span>
                      <IconArrow
                        className="text-ink-50 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
