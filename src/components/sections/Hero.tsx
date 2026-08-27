import Link from 'next/link';

import { Picture } from '@/components/Picture';
import { IconClock, IconPhone, IconPin } from '@/components/icons';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath } from '@/lib/routes';

/**
 * A full-bleed photographic band under the header. The photograph is the
 * surface, not an inset — so everything above it is set in paper on ink, and a
 * two-stop scrim keeps the type at contrast whatever the crop resolves to.
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const scene = sceneById('scene-entree-crepuscule');
  const area = locale === 'fr' ? 'Laval & Rive-Nord' : 'Laval & North Shore';
  const hours = locale === 'fr' ? site.hours.displayFr : site.hours.displayEn;

  const facts = [
    { label: t.common.serviceArea, value: area, icon: IconPin, href: undefined },
    {
      label: t.common.phone,
      value: site.phone.display,
      icon: IconPhone,
      href: site.phone.href,
    },
    { label: t.common.hours, value: hours, icon: IconClock, href: undefined },
  ];

  return (
    <section className="s-ink on-ink relative isolate overflow-hidden">
      {/* ----------------------------------------------------------- backdrop */}
      <div className="absolute inset-0 -z-10">
        <Picture
          priority
          alt={scene?.alt[locale] ?? ''}
          sizes="100vw"
          sources={[
            // 21:9 only once the viewport is genuinely letterbox-shaped;
            // below that a 16:9 crop survives `object-cover` without losing
            // the tree on one side and the garage on the other.
            source('scene-entree-crepuscule', 'wide', '(min-width: 100rem)'),
            source('scene-entree-crepuscule', 'landscape', '(min-width: 40rem)'),
            source('scene-entree-crepuscule', 'mobile'),
          ]}
          className="block h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
        {/* Two scrims in the section's own navy, kept light enough that the
            dusk photograph stays a photograph and the band belongs to the
            white pages under it: one up from the base to carry the type, one
            in from the left so the headline never fights the lit doorway on
            the right. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(9_22_38/0.86)_0%,rgb(9_22_38/0.66)_30%,rgb(9_22_38/0.3)_62%,rgb(9_22_38/0.16)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgb(9_22_38/0.58)_0%,rgb(9_22_38/0.28)_46%,rgb(9_22_38/0)_82%)] lg:block"
        />
        {/* Below `lg` the column runs full width and its eyebrow climbs into
            the sunset, where a light blue on a light cloud has nothing to sit
            against. A short cap over the top quarter only — gone before the
            headline, so the band keeps its new lightness everywhere it shows. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(9_22_38/0.42)_0%,rgb(9_22_38/0)_26%)] lg:hidden"
        />
        {/* The blue bloom the rest of the dark surfaces carry. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(120%_130%_at_10%_-14%,rgb(35_79_138/0.32)_0%,transparent_58%)]"
        />
      </div>

      {/* ---------------------------------------------------------- editorial */}
      <div className="u-wrap flex min-h-[clamp(30rem,80svh,46rem)] flex-col justify-end pt-16 pb-10 lg:min-h-[clamp(34rem,86svh,50rem)] lg:pt-28 lg:pb-14">
        <div className="max-w-3xl">
          <p className="u-label text-teal">{t.hero.eyebrow}</p>
          <span className="u-tick mt-3.5" aria-hidden="true" />

          <h1 className="u-display text-paper mt-7">{t.hero.title}</h1>
          <p className="u-accent text-teal mt-4 text-[clamp(1.6rem,3.4vw,2.6rem)]">
            {t.hero.accent}
          </p>

          <p className="text-dust mt-7 max-w-xl text-[1.0625rem] leading-[1.68] sm:text-[1.1875rem]">
            {t.hero.lede}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={pagePath(locale, 'contact')} className="btn btn-brass rounded-sm">
              {t.common.quote}
            </Link>
            <Link href={pagePath(locale, 'projects')} className="btn btn-stone rounded-sm">
              {t.common.viewWork}
            </Link>
          </div>
        </div>

        {/* The three facts, ruled straight onto the photograph. */}
        <dl className="mt-12 grid gap-px border-t border-[var(--line-dark)] sm:grid-cols-3 lg:mt-14">
          {facts.map(({ label, value, icon: Icon, href }, index) => (
            <div
              key={label}
              className={`flex flex-col gap-1.5 py-4 sm:py-5 ${
                index > 0
                  ? 'border-t border-[var(--line-dark)] sm:border-t-0 sm:border-l sm:pl-6'
                  : ''
              }`}
            >
              <dt className="u-label text-dust-2 text-[0.5625rem] tracking-[0.2em]">{label}</dt>
              <dd className="text-paper text-[0.9375rem]">
                {href ? (
                  <a
                    href={href}
                    className="hover:text-teal inline-flex min-h-9 items-center gap-2.5 font-[550] transition-colors"
                  >
                    <Icon className="text-teal h-4 w-4 shrink-0" />
                    {value}
                  </a>
                ) : (
                  <span className="inline-flex min-h-9 items-center gap-2.5">
                    <Icon className="text-teal h-4 w-4 shrink-0" />
                    {value}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
