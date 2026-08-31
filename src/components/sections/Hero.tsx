import { Picture } from '@/components/Picture';
import { OpenGuidedForm } from '@/components/guided/OpenGuidedForm';
import { IconCamera } from '@/components/icons';
import { getDictionary } from '@/content/dictionary';
import { verifiedCredentials } from '@/content/placeholders';
import { sceneById } from '@/content/imagery';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath } from '@/lib/routes';

/**
 * The five-second band.
 *
 * Everything a visitor needs to decide whether this is the right company is
 * above the fold: what Oasis does, where, the promise, and two ways to act.
 * The trust badges sit directly under the buttons because the question that
 * follows "can they help me" is always "are they real".
 *
 * The photograph is the surface rather than an inset, so a two-stop scrim
 * carries the type at contrast whatever the crop resolves to. The scrim is
 * heavier on small screens, where the column runs the full width of a
 * portrait crop and the type sits straight over the lit windows.
 */
export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const scene = sceneById('scene-entree-crepuscule');

  /* Only what can actually be stood behind today. The licence number and the
     insurer join this line the moment they are filled in. */
  const badges = verifiedCredentials(locale);

  return (
    <section className="s-ink on-ink relative isolate overflow-hidden">
      {/* ----------------------------------------------------------- backdrop */}
      <div className="absolute inset-0 -z-10">
        <Picture
          priority
          alt={scene?.alt[locale] ?? t.hero.imageAlt}
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
        {/* 40% over the whole frame on desktop, 50% below it, per the design
            system - then a base ramp so the type at the bottom clears the
            brightest part of the photograph, and the band drains into the
            trust bar underneath instead of stopping at an edge. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[rgb(18_16_14/0.40)] lg:bg-[rgb(18_16_14/0.34)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgb(18_16_14/1)_0%,rgb(18_16_14/0.8)_12%,rgb(18_16_14/0.42)_38%,rgb(18_16_14/0.1)_72%,transparent_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgb(18_16_14/0.5)_0%,rgb(18_16_14/0.22)_48%,transparent_84%)] lg:block"
        />
      </div>

      {/* ---------------------------------------------------------- editorial */}
      <div className="u-wrap flex min-h-[70svh] flex-col justify-end pt-16 pb-12 lg:min-h-[85svh] lg:pt-28 lg:pb-16">
        {/* The hero is painted before any observer could run, so its entrance
            is pure CSS and staged in reading order: label, headline, promise,
            action. The headline starts almost immediately - it is the thing
            the largest paint is measured on, and nothing is gained by holding
            it back. */}
        <div className="max-w-3xl text-center lg:text-left">
          <p className="rise u-label text-brass">{t.hero.eyebrow}</p>
          <span className="rise u-tick mx-auto mt-3.5 lg:mx-0" aria-hidden="true" />

          <h1
            className="rise u-display text-paper mt-7"
            style={{ ['--rise-delay' as string]: '60ms' }}
          >
            {t.hero.title}
          </h1>

          <p
            className="rise text-dust mx-auto mt-7 max-w-xl text-[1.0625rem] leading-[1.65] sm:text-[1.1875rem] lg:mx-0"
            style={{ ['--rise-delay' as string]: '190ms' }}
          >
            {t.hero.lede}
          </p>

          {/* Doubles as the thumb-bar sentinel: while these two buttons are on
              screen the pinned mobile bar would only be repeating them. */}
          <div
            data-sentinel="hero-cta"
            className="rise mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            style={{ ['--rise-delay' as string]: '280ms' }}
          >
            {/* Both keys open the same six questions. The photo is step 5 of
                that flow, so "envoyez-nous une photo" is a description of
                where the visitor lands, not a second funnel. */}
            <OpenGuidedForm
              href={pagePath(locale, 'contact')}
              label={t.common.quote}
              location="hero-quote"
              className="btn btn-brass"
            />
            <OpenGuidedForm
              href={pagePath(locale, 'photo')}
              label={t.common.photoCta}
              location="hero-photo"
              className="btn btn-quarry"
            >
              <IconCamera className="h-4.5 w-4.5" />
            </OpenGuidedForm>
          </div>

          <ul
            className="rise text-dust-2 mt-7 flex flex-wrap justify-center gap-x-2.5 gap-y-1.5 text-[0.8125rem] lg:justify-start"
            style={{ ['--rise-delay' as string]: '380ms' }}
          >
            {badges.map((badge, index) => (
              <li key={badge} className="flex items-center gap-2.5">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-dust-2/50">
                    •
                  </span>
                ) : null}
                <span>{badge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
