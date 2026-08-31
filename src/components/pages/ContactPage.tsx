import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Picture } from '@/components/Picture';
import { QuoteForm } from '@/components/QuoteForm';
import {
  IconCamera,
  IconClock,
  IconFacebook,
  IconInstagram,
  IconMail,
  IconPhone,
  IconPin,
} from '@/components/icons';
import { Eyebrow } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import { services } from '@/content/services';
import { phones, site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath } from '@/lib/routes';
import Link from 'next/link';

export function ContactPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const hours = locale === 'fr' ? site.hours.displayFr : site.hours.displayEn;
  const area = locale === 'fr' ? 'Laval et Rive-Nord' : 'Laval and the North Shore';
  const scene = sceneById('scene-entree-pierre');

  return (
    <>
      <section className="u-section-tight pb-0">
        <div className="u-wrap">
          <Breadcrumbs
            label={t.common.breadcrumb}
            className="mb-8"
            items={[
              { name: t.common.home, path: pagePath(locale, 'home') },
              { name: t.nav.contact, path: pagePath(locale, 'contact') },
            ]}
          />
          <div className="max-w-2xl">
            <Eyebrow>{t.contactPage.eyebrow}</Eyebrow>
            <span className="u-tick mt-3" aria-hidden="true" />
            <h1 className="u-display mt-6">{t.contactPage.title}</h1>
            <p className="u-lede mt-6">{t.contactPage.lede}</p>
          </div>
        </div>
      </section>

      {/* The pinned thumb bar is 60px tall; the extra bottom padding is what
          keeps it off the submit button on a phone. */}
      <section className="u-section pb-[7.5rem] md:pb-[clamp(3.5rem,7vw,6.5rem)]">
        <div className="u-wrap grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="u-h3 text-[1.25rem]">{t.contactPage.directTitle}</h2>
            <p className="u-body mt-3 text-[0.9375rem]">{t.contactPage.directBody}</p>

            <ul className="mt-6 flex flex-col gap-3">
              {phones.map((entry) => (
                <li key={entry.href}>
                  <a
                    href={entry.href}
                    data-cta={t.common.callNow}
                    data-cta-location="contact-page"
                    className="btn btn-brass w-full justify-start"
                    aria-label={`${t.common.callUs} — ${entry.name} : ${entry.display}`}
                  >
                    <IconPhone className="h-4.5 w-4.5" />
                    <span>
                      {entry.name} — {entry.display}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href={pagePath(locale, 'photo')}
                  data-cta={t.common.photoCta}
                  data-cta-location="contact-page"
                  className="btn btn-quarry w-full justify-start"
                >
                  <IconCamera className="h-4.5 w-4.5" />
                  {t.common.photoCta}
                </Link>
              </li>
            </ul>

            <h2 className="u-h3 mt-10 text-[1.25rem]">{t.contactPage.detailsTitle}</h2>
            <dl className="mt-5 flex flex-col">
              {[
                {
                  label: t.common.courriel,
                  value: site.email.display,
                  href: site.email.href,
                  icon: <IconMail className="text-brass-deep h-4.5 w-4.5" />,
                },
                {
                  label: t.common.address,
                  value: site.address.display,
                  icon: <IconPin className="text-brass-deep h-4.5 w-4.5" />,
                },
                {
                  label: t.common.serviceArea,
                  value: area,
                  icon: <IconPin className="text-brass-deep h-4.5 w-4.5" />,
                },
                {
                  label: t.common.hours,
                  value: hours,
                  icon: <IconClock className="text-brass-deep h-4.5 w-4.5" />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3.5 border-b border-[var(--line)] py-4 last:border-b-0"
                >
                  <span className="mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <dt className="u-label text-ink-50 text-[0.5625rem] tracking-[0.2em]">
                      {item.label}
                    </dt>
                    <dd className="text-ink mt-1 text-[0.9375rem]">
                      {item.href ? (
                        <a
                          href={item.href}
                          className="link-rule min-h-11 text-[0.9375rem] break-all"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <p className="u-meta mt-5">{t.contactPage.mapNote}</p>

            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={t.common.followInstagram}
                className="btn btn-quarry btn-compact h-11 min-h-11 w-11 !px-0"
              >
                <IconInstagram className="h-5 w-5" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={t.common.followFacebook}
                className="btn btn-quarry btn-compact h-11 min-h-11 w-11 !px-0"
              >
                <IconFacebook className="h-5 w-5" />
              </a>
            </div>

            <figure className="mt-10">
              <div className="frame frame-keyline aspect-[4/3]">
                <Picture
                  alt={scene?.alt[locale] ?? ''}
                  sizes="(min-width: 64rem) 36vw, 92vw"
                  sources={[source('scene-entree-pierre', 'wide')]}
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              </div>
            </figure>
          </div>

          <div className="lg:col-span-7">
            <h2 className="u-h3 text-[1.25rem]">{t.contactPage.formTitle}</h2>
            <div className="glass-panel mt-5 p-6 lg:p-8">
              <QuoteForm
                locale={locale}
                variant="contact"
                serviceOptions={services.map((s) => ({
                  value: s.key,
                  label: s.copy[locale].name,
                }))}
                privacyHref={pagePath(locale, 'privacy')}
                phone={{ href: site.phone.href, display: site.phone.display }}
                email={{ href: site.email.href, display: site.email.display }}
                t={t}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
