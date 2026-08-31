import { GuidedForm } from '@/components/guided/GuidedForm';
import { OpenGuidedForm } from '@/components/guided/OpenGuidedForm';
import { IconCamera, IconPhone } from '@/components/icons';
import { Eyebrow } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { credentialLine } from '@/content/placeholders';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath, type ServiceKey } from '@/lib/routes';

/**
 * The last thing on every page except the contact page itself: three ways to
 * convert, in descending order of how much the visitor has to commit — call,
 * send a photo, or answer six questions by tapping. The photo button and the
 * form are the same flow: the photograph is step 5 of it, so a visitor who
 * arrives wanting to send a picture lands on the question that asks for one
 * rather than in a second funnel with its own lead schema.
 *
 * The extra bottom padding is not decoration: the pinned thumb bar is 60px
 * tall and would otherwise cover the submit button.
 */
export function FinalCta({
  locale,
  defaultService,
  className = '',
}: {
  locale: Locale;
  defaultService?: ServiceKey;
  className?: string;
}) {
  const t = getDictionary(locale);

  return (
    <section
      id="devis"
      className={`s-ink on-ink u-section scroll-mt-24 pb-[7.5rem] md:pb-[clamp(3.5rem,7vw,6.5rem)] ${className}`}
    >
      <div className="grain-overlay">
        <div className="u-wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="reveal">
            <Eyebrow tone="brass">{t.finalCta.eyebrow}</Eyebrow>
            <span className="u-tick mt-3" aria-hidden="true" />
            <h2 className="u-h2 text-paper mt-5">{t.finalCta.title}</h2>
            <p className="text-dust mt-5 max-w-md text-[1.0625rem] leading-[1.65]">
              {t.finalCta.body}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={site.phone.href}
                data-cta={t.common.callNow}
                data-cta-location="final-cta"
                className="btn btn-brass"
                aria-label={`${t.common.callUs} : ${site.phone.display}`}
              >
                <IconPhone className="h-4.5 w-4.5" />
                {t.common.callNow}
              </a>
              <OpenGuidedForm
                href={pagePath(locale, 'photo')}
                label={t.common.photoCta}
                location="final-cta-photo"
                service={defaultService}
                className="btn btn-quarry"
              >
                <IconCamera className="h-4.5 w-4.5" />
              </OpenGuidedForm>
            </div>

            <p className="u-meta text-dust-2 mt-5">
              {t.finalCta.orCall}{' '}
              <a href={site.phone.href} className="link-rule text-paper text-[0.8125rem]">
                {site.phone.display}
              </a>
            </p>

            <p className="u-label text-dust-2 mt-10 max-w-sm text-[0.5625rem] leading-[1.8] tracking-[0.14em]">
              {[t.finalCta.trustLine, credentialLine(locale)].filter(Boolean).join(' ')}
            </p>
          </div>

          <div className="glass-panel reveal reveal-r py-2">
            <GuidedForm
              locale={locale}
              source={`final-cta:${defaultService ?? 'general'}`}
              defaultService={defaultService}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
