import { Breadcrumbs } from '@/components/Breadcrumbs';
import { GuidedForm } from '@/components/guided/GuidedForm';
import { ProcessSteps } from '@/components/sections/Process';
import { IconCheck, IconPhone } from '@/components/icons';
import { Eyebrow, NoteCard } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';

/**
 * The photo funnel.
 *
 * A dedicated page as well as a modal: it can be linked from an ad, from a
 * text message and from the pinned thumb bar, it survives a page reload, and
 * it gets its own analytics view. The modal on the rest of the site runs the
 * same component, so there is one flow and one lead schema — the photograph
 * is step 5 of the guided form, not a funnel of its own.
 *
 * The disclaimer is above the form as well as inside the photo step. Setting
 * the expectation that a photo is a first read and not a quote is the whole
 * reason this funnel builds trust instead of spending it.
 */
export function PhotoPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <>
      <section className="u-section-tight pb-0">
        <div className="u-wrap">
          <Breadcrumbs
            label={t.common.breadcrumb}
            className="mb-8"
            items={[
              { name: t.common.home, path: pagePath(locale, 'home') },
              { name: t.photoPage.title, path: pagePath(locale, 'photo') },
            ]}
          />
          <div className="max-w-2xl">
            <Eyebrow>{t.photoPage.eyebrow}</Eyebrow>
            <span className="u-tick mt-3" aria-hidden="true" />
            <h1 className="u-display mt-6">{t.photoPage.title}</h1>
            <p className="u-lede mt-6">{t.photoPage.lede}</p>
          </div>
        </div>
      </section>

      <section className="u-section">
        <div className="u-wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <NoteCard label={t.photoPage.disclaimerLabel} className="mb-8">
              {t.photoPage.disclaimer}
            </NoteCard>

            <div className="glass-panel py-2">
              <GuidedForm locale={locale} source="photo-page" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <h2 className="u-h3 text-[1.25rem]">{t.photoPage.tipsTitle}</h2>
            <ul className="mt-5 flex flex-col">
              {t.photoPage.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 border-b border-[var(--line)] py-3.5 last:border-b-0"
                >
                  <IconCheck className="text-brass-deep mt-0.5 h-5 w-5 shrink-0" />
                  <span className="u-body text-[0.9375rem]">{tip}</span>
                </li>
              ))}
            </ul>

            <div className="s-plaque mt-8 px-5 py-5">
              <p className="relative z-10 flex items-center gap-2.5">
                <IconPhone className="text-brass-deep h-5 w-5 shrink-0" />
                <a href={site.phone.href} className="link-rule text-[1.0625rem]">
                  {site.phone.display}
                </a>
              </p>
              <p className="u-meta relative z-10 mt-2">
                {locale === 'fr' ? site.hours.displayFr : site.hours.displayEn}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sand u-section border-y border-[var(--line)] pb-[7.5rem] md:pb-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="u-wrap">
          <h2 className="u-h2 reveal">{t.photoPage.stepsTitle}</h2>
          <ProcessSteps steps={t.photoPage.steps} className="mt-10 lg:grid-cols-3 lg:gap-x-7" />
        </div>
      </section>
    </>
  );
}
