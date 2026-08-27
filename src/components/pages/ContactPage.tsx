import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs';
import { Picture } from '@/components/Picture';
import { QuoteForm } from '@/components/QuoteForm';
import {
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
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath } from '@/lib/routes';

export function ContactPage({ locale, crumbs }: { locale: Locale; crumbs: Crumb[] }) {
  const t = getDictionary(locale);
  const hours = locale === 'fr' ? site.hours.displayFr : site.hours.displayEn;
  const area = locale === 'fr' ? 'Laval et Rive-Nord' : 'Laval and the North Shore';
  const scene = sceneById('scene-entree-pierre');

  const details = [
    {
      label: t.common.phone,
      value: site.phone.display,
      href: site.phone.href,
      icon: <IconPhone className="text-teal-deep h-4.5 w-4.5" />,
      big: true,
    },
    {
      label: t.common.courriel,
      value: site.email.display,
      href: site.email.href,
      icon: <IconMail className="text-teal-deep h-4.5 w-4.5" />,
    },
    {
      label: t.common.address,
      value: site.address.street,
      icon: <IconPin className="text-teal-deep h-4.5 w-4.5" />,
    },
    {
      label: t.common.serviceArea,
      value: area,
      icon: <IconPin className="text-teal-deep h-4.5 w-4.5" />,
    },
    {
      label: t.common.hours,
      value: hours,
      icon: <IconClock className="text-teal-deep h-4.5 w-4.5" />,
    },
  ];

  return (
    <>
      <section className="u-wrap pt-8 pb-4 lg:pt-12">
        <Breadcrumbs items={crumbs} label={t.common.breadcrumb} />
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Eyebrow>{t.contactPage.eyebrow}</Eyebrow>
            <span className="u-tick mt-3.5" aria-hidden="true" />
            <h1 className="u-display mt-6 text-[clamp(2.25rem,5.6vw,4rem)]">
              {t.contactPage.title}
            </h1>
          </div>
          <div className="lg:col-span-5 lg:pt-4">
            <p className="u-lede">{t.contactPage.lede}</p>
          </div>
        </div>
      </section>

      <section className="u-section-tight">
        <div className="u-wrap grid gap-10 border-t border-[var(--line-strong)] pt-10 lg:grid-cols-12 lg:gap-14">
          {/* ------------------------------------------------------- coordinates */}
          <div className="lg:col-span-4">
            <h2 className="u-h3 text-[1.25rem]">{t.contactPage.detailsTitle}</h2>

            <dl className="mt-6 flex flex-col">
              {details.map((item) => (
                <div key={item.label} className="border-t border-[var(--line)] py-4">
                  <dt className="u-label text-ink-50 text-[0.5625rem] tracking-[0.2em]">
                    {item.label}
                  </dt>
                  <dd
                    className={`mt-2 ${item.big ? 'text-[1.375rem] font-[560]' : 'text-[0.9375rem]'}`}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        className="link-rule inline-flex min-h-9 items-center break-all"
                      >
                        {item.icon}
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-ink-70 inline-flex items-center gap-2.5">
                        {item.icon}
                        {item.value}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="s-plaque mt-8 px-5 py-4">
              <p className="u-h3 relative z-10 text-[1.0625rem]">{t.contactPage.directTitle}</p>
              <p className="u-body relative z-10 mt-2 text-[0.9375rem]">
                {t.contactPage.directBody}
              </p>
              <a
                href={site.phone.href}
                className="btn btn-stone relative z-10 mt-4 w-full rounded-sm"
              >
                <IconPhone className="h-4 w-4" />
                {site.phone.display}
              </a>
            </div>

            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={t.common.followInstagram}
                className="s-plaque text-ink-70 hover:text-teal-deep inline-flex h-11 w-11 items-center justify-center transition-colors"
              >
                <IconInstagram className="relative z-10 h-5 w-5" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label={t.common.followFacebook}
                className="s-plaque text-ink-70 hover:text-teal-deep inline-flex h-11 w-11 items-center justify-center transition-colors"
              >
                <IconFacebook className="relative z-10 h-5 w-5" />
              </a>
            </div>
          </div>

          {/* -------------------------------------------------------------- form */}
          <div className="lg:col-span-8">
            <div className="s-plaque clip-notch-sm p-6 sm:p-8 lg:p-10">
              <div className="relative z-10">
                <h2 className="u-h3 text-[1.25rem]">{t.contactPage.formTitle}</h2>
                <QuoteForm
                  className="mt-7"
                  locale={locale}
                  variant="full"
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
      </section>

      {/* A full-bleed close, so the page ends on the work rather than on a
          form field. */}
      <figure className="mt-4">
        <div className="frame">
          <Picture
            alt={scene?.alt[locale] ?? ''}
            sizes="100vw"
            sources={[
              source('scene-entree-pierre', 'banner', '(min-width: 40rem)'),
              source('scene-entree-pierre', 'portrait'),
            ]}
            imgClassName="h-full w-full object-cover"
          />
        </div>
        <figcaption className="u-wrap mt-3">
          <span className="u-meta block max-w-2xl">{scene?.caption[locale]}</span>
        </figcaption>
      </figure>
    </>
  );
}
