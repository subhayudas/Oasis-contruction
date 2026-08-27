import { QuoteForm } from '@/components/QuoteForm';
import { IconClock, IconMail, IconPhone, IconPin } from '@/components/icons';
import { Eyebrow } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { services } from '@/content/services';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';

/**
 * The closing quote panel: the fastest route to a conversation on the left,
 * a compact form on the right. Both are always usable — the phone and email
 * links never depend on the form working.
 */
export function ContactPanel({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const hours = locale === 'fr' ? site.hours.displayFr : site.hours.displayEn;
  const area = locale === 'fr' ? 'Laval et Rive-Nord' : 'Laval and the North Shore';

  return (
    <section id="soumission" className="s-ink on-ink">
      <div className="grain-overlay">
        <div className="u-wrap u-section">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="reveal lg:col-span-5">
              <Eyebrow tone="teal">{t.contactPanel.eyebrow}</Eyebrow>
              <span className="u-tick mt-3.5" aria-hidden="true" />
              <h2 className="u-h2 text-paper mt-5">{t.contactPanel.title}</h2>
              <p className="u-accent text-teal mt-2.5 text-[clamp(1.35rem,2.4vw,2rem)]">
                {t.contactPanel.accent}
              </p>
              <p className="text-dust mt-6 max-w-md text-[1.0625rem] leading-[1.68]">
                {t.contactPanel.lede}
              </p>

              <dl className="mt-9 flex flex-col gap-px">
                <div className="flex items-baseline gap-4 border-t border-[var(--line-dark)] py-4">
                  <dt className="u-label text-dust-2 w-24 shrink-0 text-[0.5625rem]">
                    {t.common.phone}
                  </dt>
                  <dd>
                    <a
                      href={site.phone.href}
                      className="text-paper hover:text-teal inline-flex min-h-9 items-center gap-2.5 text-[1.125rem] font-[550] transition-colors"
                    >
                      <IconPhone className="text-teal h-4 w-4" />
                      {site.phone.display}
                    </a>
                  </dd>
                </div>
                <div className="flex items-baseline gap-4 border-t border-[var(--line-dark)] py-4">
                  <dt className="u-label text-dust-2 w-24 shrink-0 text-[0.5625rem]">
                    {t.common.courriel}
                  </dt>
                  <dd>
                    <a
                      href={site.email.href}
                      className="text-paper hover:text-teal inline-flex min-h-9 items-center gap-2.5 text-[0.9375rem] break-all transition-colors"
                    >
                      <IconMail className="text-teal h-4 w-4 shrink-0" />
                      {site.email.display}
                    </a>
                  </dd>
                </div>
                <div className="flex items-baseline gap-4 border-t border-[var(--line-dark)] py-4">
                  <dt className="u-label text-dust-2 w-24 shrink-0 text-[0.5625rem]">
                    {t.common.serviceArea}
                  </dt>
                  <dd className="text-dust flex items-center gap-2.5 text-[0.9375rem]">
                    <IconPin className="text-teal h-4 w-4 shrink-0" />
                    {area}
                  </dd>
                </div>
                <div className="flex items-baseline gap-4 border-y border-[var(--line-dark)] py-4">
                  <dt className="u-label text-dust-2 w-24 shrink-0 text-[0.5625rem]">
                    {t.common.hours}
                  </dt>
                  <dd className="text-dust flex items-center gap-2.5 text-[0.9375rem]">
                    <IconClock className="text-teal h-4 w-4 shrink-0" />
                    {hours}
                  </dd>
                </div>
              </dl>
            </div>

            {/* The form sits on paper, mounted on the dark band like a printed card. */}
            <div className="reveal lg:col-span-7">
              <div className="s-plaque clip-notch-sm p-6 sm:p-8">
                <div className="relative z-10">
                  <QuoteForm
                    locale={locale}
                    variant="compact"
                    serviceOptions={services.map((service) => ({
                      value: service.key,
                      label: service.copy[locale].name,
                    }))}
                    privacyHref={pagePath(locale, 'privacy')}
                    phone={{ href: site.phone.href, display: site.phone.display }}
                    email={{ href: site.email.href, display: site.email.display }}
                    labels={t.form}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
