import Link from 'next/link';

import { QuoteForm } from '@/components/QuoteForm';
import { IconCamera, IconPhone } from '@/components/icons';
import { Eyebrow } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { fill } from '@/content/placeholders';
import { services } from '@/content/services';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath, type ServiceKey } from '@/lib/routes';

/**
 * The last thing on every page except the contact page itself: three ways to
 * convert, in descending order of how much the visitor has to commit — call,
 * send a photo, or write. The form sits on the right on desktop and last on a
 * phone, where the two buttons above it are the ones a thumb can reach.
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

  const serviceOptions = services.map((service) => ({
    value: service.key,
    label: service.copy[locale].name,
  }));

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
              <Link
                href={pagePath(locale, 'photo')}
                data-cta={t.common.photoCta}
                data-cta-location="final-cta"
                className="btn btn-quarry"
              >
                <IconCamera className="h-4.5 w-4.5" />
                {t.common.photoCta}
              </Link>
            </div>

            <p className="u-meta text-dust-2 mt-5">
              {t.finalCta.orCall}{' '}
              <a href={site.phone.href} className="link-rule text-paper text-[0.8125rem]">
                {site.phone.display}
              </a>
            </p>

            <p className="u-label text-dust-2 mt-10 max-w-sm text-[0.5625rem] leading-[1.8] tracking-[0.14em]">
              {fill(t.finalCta.trustLine)}
            </p>
          </div>

          <div className="glass-panel reveal reveal-r p-6 lg:p-8">
            <QuoteForm
              locale={locale}
              variant="general"
              serviceOptions={serviceOptions}
              defaultService={defaultService ?? ''}
              privacyHref={pagePath(locale, 'privacy')}
              phone={{ href: site.phone.href, display: site.phone.display }}
              email={{ href: site.email.href, display: site.email.display }}
              t={t}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
