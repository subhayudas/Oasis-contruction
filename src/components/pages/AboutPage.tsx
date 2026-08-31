import Link from 'next/link';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Picture } from '@/components/Picture';
import { FinalCta } from '@/components/sections/FinalCta';
import { NoteCard } from '@/components/ui';
import { IconArrow, IconClock, IconPhone, IconPin, serviceIcons } from '@/components/icons';
import { Eyebrow, InfoPlaque } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import { services } from '@/content/services';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath, servicePath } from '@/lib/routes';
import { fill, fillOrNull, hasFact } from '@/content/placeholders';

export function AboutPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const hours = locale === 'fr' ? site.hours.displayFr : site.hours.displayEn;
  const area = locale === 'fr' ? 'Laval & Rive-Nord' : 'Laval & North Shore';
  const portrait = sceneById('scene-equipe-chantier');
  const wide = sceneById('scene-terrasse-finie');
  const credentials = fillOrNull(t.aboutPage.credentialsBody);

  return (
    <>
      <section className="u-wrap pt-8 pb-4 lg:pt-12">
        <Breadcrumbs
          label={t.common.breadcrumb}
          items={[
            { name: t.common.home, path: pagePath(locale, 'home') },
            { name: t.nav.about, path: pagePath(locale, 'about') },
          ]}
        />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Eyebrow>{t.aboutPage.eyebrow}</Eyebrow>
            <span className="u-tick mt-3.5" aria-hidden="true" />
            <h1 className="u-display mt-6">{t.aboutPage.title}</h1>
            <p className="u-accent text-brass-deep mt-3 text-[clamp(1.25rem,2vw,1.625rem)]">
              {t.aboutPage.accent}
            </p>
            <p className="u-lede mt-7 max-w-xl">{t.aboutPage.lede}</p>

            <InfoPlaque
              className="mt-9 max-w-xl"
              items={[
                {
                  label: t.common.serviceArea,
                  value: area,
                  icon: <IconPin className="text-brass-deep h-4 w-4 shrink-0" />,
                },
                {
                  label: t.common.phone,
                  value: site.phone.display,
                  href: site.phone.href,
                  icon: <IconPhone className="text-brass-deep h-4 w-4 shrink-0" />,
                },
                {
                  label: t.common.hours,
                  value: hours,
                  icon: <IconClock className="text-brass-deep h-4 w-4 shrink-0" />,
                },
              ]}
            />
          </div>

          <figure className="lg:col-span-5">
            <div className="frame frame-keyline clip-notch shadow-[0_2px_4px_rgba(26,22,16,0.07),0_40px_60px_-46px_rgba(26,22,16,0.85)]">
              <Picture
                priority
                alt={portrait?.alt[locale] ?? ''}
                sizes="(min-width: 1024px) 40vw, 100vw"
                sources={[
                  source('scene-equipe-chantier', 'portrait', '(min-width: 64rem)'),
                  source('scene-equipe-chantier', 'wide'),
                ]}
                imgClassName="w-full h-auto"
              />
            </div>
            <figcaption className="u-meta mt-3">{portrait?.caption[locale]}</figcaption>
          </figure>
        </div>
      </section>

      {/* ---------------------------------------------------------------- story */}
      <section className="u-section">
        <div className="u-wrap grid gap-10 border-t border-[var(--line-strong)] pt-10 lg:grid-cols-12 lg:gap-14">
          <h2 className="u-h2 reveal lg:col-span-4">{t.aboutPage.storyTitle}</h2>
          <div className="reveal flex flex-col gap-5 lg:col-span-8">
            {t.aboutPage.story.map((paragraph, index) => (
              <p
                key={paragraph}
                className={index === 0 ? 'u-lede text-[1.1875rem]' : 'u-body text-[1.0625rem]'}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- approach */}
      <section className="s-sand u-section">
        <div className="u-wrap">
          <h2 className="u-h2 reveal">{t.aboutPage.approachTitle}</h2>
          <ol className="mt-10 grid gap-px lg:grid-cols-3 lg:gap-x-8">
            {t.aboutPage.approach.map((item, index) => (
              <li
                key={item.title}
                className={`reveal border-t border-[var(--line-strong)] pt-6 ${
                  index > 0 ? 'lg:border-l lg:pl-8' : ''
                }`}
                style={{ ['--reveal-delay' as string]: `${index * 70}ms` }}
              >
                <span className="u-label text-umber block text-[0.6875rem] tracking-[0.24em]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="u-h3 mt-4">{item.title}</h3>
                <p className="u-body mt-3 text-[0.9375rem]">{item.text}</p>
              </li>
            ))}
          </ol>

          <figure className="reveal mt-14">
            <div className="frame frame-keyline clip-notch-sm shadow-[0_2px_4px_rgba(26,22,16,0.07),0_36px_54px_-44px_rgba(26,22,16,0.85)]">
              <Picture
                alt={wide?.alt[locale] ?? ''}
                sizes="100vw"
                sources={[source('scene-terrasse-finie', 'wide')]}
                imgClassName="w-full h-auto"
              />
            </div>
            <figcaption className="u-meta mt-3">{wide?.caption[locale]}</figcaption>
          </figure>
        </div>
      </section>

      {/* -------------------------------------------------------------- services */}
      {/* -------------------------------------------------- team + credentials */}
      <section className="u-section">
        <div className="u-wrap grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="reveal">
            <h2 className="u-h2">{t.aboutPage.teamTitle}</h2>
            {/* The founders' names, photographs and biographies have not been
                supplied. Rather than a stock portrait and a paragraph of
                invented history, the page says what is missing and points at
                the two people who actually answer the phone. */}
            {hasFact('founderName') ? (
              <p className="u-body mt-5 max-w-xl">{fill(t.aboutPage.teamBody)}</p>
            ) : (
              <NoteCard label={t.common.toBeConfirmed} className="mt-6 max-w-xl">
                {t.aboutPage.teamPending}
              </NoteCard>
            )}
          </div>

          <div className="reveal">
            <h2 className="u-h2">{t.aboutPage.credentialsTitle}</h2>
            {credentials ? (
              <p className="u-body mt-5 max-w-xl">{credentials}</p>
            ) : (
              <NoteCard label={t.common.toBeConfirmed} className="mt-6 max-w-xl">
                {t.aboutPage.credentialsPending}
              </NoteCard>
            )}
          </div>
        </div>
      </section>

      <section className="u-section">
        <div className="u-wrap grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="reveal lg:col-span-4">
            <h2 className="u-h2">{t.aboutPage.servicesTitle}</h2>
            <p className="u-lede mt-5">{t.aboutPage.servicesLede}</p>

            <div className="s-plaque mt-8 px-5 py-4">
              <p className="u-label text-umber relative z-10">{t.aboutPage.areaTitle}</p>
              <p className="u-body relative z-10 mt-2 text-[0.9375rem]">
                {t.aboutPage.areaBody}
              </p>
            </div>
          </div>

          <ul className="reveal lg:col-span-8">
            {services.map((service) => {
              const Icon = serviceIcons[service.key];
              return (
                <li key={service.key} className="border-t border-[var(--line)]">
                  <Link
                    href={servicePath(locale, service.key)}
                    className="group flex min-h-20 items-center gap-5 py-5"
                  >
                    <span
                      className="s-chip text-ink-80 flex h-11 w-11 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="u-h3 block">{service.copy[locale].name}</span>
                      <span className="u-meta mt-1 block max-w-lg">
                        {service.copy[locale].short}
                      </span>
                    </span>
                    <IconArrow className="text-ink-50 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <FinalCta locale={locale} />
    </>
  );
}
