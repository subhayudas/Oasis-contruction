import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { BrandMark } from '@/components/BrandMark';
import { Picture } from '@/components/Picture';
import { QuoteForm } from '@/components/QuoteForm';
import { Recaptcha } from '@/components/Recaptcha';
import { TestimonialGrid } from '@/components/Testimonials';
import { IconCheck, IconPhone } from '@/components/icons';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import { credentialLine } from '@/content/placeholders';
import { services } from '@/content/services';
import { site } from '@/content/site';
import { defaultLocale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { landingSlugs, pagePath, type LandingKey, type ServiceKey } from '@/lib/routes';
import { geist, instrumentSerif } from '@/lib/fonts';

import '../../globals.css';

/**
 * Paid-traffic landing pages.
 *
 * These sit outside the [locale] tree because they need their own shell: no
 * navigation, no services dropdown, no footer links, one call to action. A
 * visitor who arrived from an ad has exactly one job here, and every extra
 * link is a way out of it.
 *
 * They are French-only and noindex — organic search should land on /pave-uni
 * and /muret, which are the pages built to rank. Two near-identical pages
 * competing for the same query is how a small site cannibalises itself.
 */
const CAMPAIGNS: Record<
  LandingKey,
  { copyKey: 'pave' | 'muret'; service: ServiceKey; scene: string }
> = {
  'pave-uni-reparation': {
    copyKey: 'pave',
    service: 'pave-uni',
    scene: 'scene-pave-uni-allee',
  },
  'muret-reparation': { copyKey: 'muret', service: 'muret', scene: 'scene-muret-talus' },
};

export function generateStaticParams() {
  return landingSlugs.map((campaign) => ({ campaign }));
}

function isCampaign(value: string): value is LandingKey {
  return (landingSlugs as readonly string[]).includes(value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ campaign: string }>;
}): Promise<Metadata> {
  const { campaign } = await params;
  if (!isCampaign(campaign)) return {};
  const t = getDictionary(defaultLocale);
  const copy = t.landing[CAMPAIGNS[campaign].copyKey];

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    // Paid traffic only. Never in the sitemap, never in the index.
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ campaign: string }>;
}) {
  const { campaign } = await params;
  if (!isCampaign(campaign)) notFound();

  const locale = defaultLocale;
  const t = getDictionary(locale);
  const config = CAMPAIGNS[campaign];
  const copy = t.landing[config.copyKey];
  const scene = sceneById(config.scene);

  return (
    <html lang="fr-CA" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body>
        <main id="main">
          <section className="s-ink on-ink relative isolate overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <Picture
                priority
                alt={scene?.alt[locale] ?? ''}
                sizes="100vw"
                sources={[source(config.scene, 'wide')]}
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[rgb(18_16_14/0.62)]" />
            </div>

            <div className="u-wrap grid gap-12 py-12 lg:grid-cols-12 lg:gap-16 lg:py-20">
              <div className="lg:col-span-6">
                <BrandMark
                  alt="Oasis Construction"
                  size={56}
                  className="rounded-full ring-1 ring-white/25"
                />

                <h1 className="u-display text-paper mt-8">{copy.title}</h1>
                <p className="text-dust mt-6 max-w-xl text-[1.0625rem] leading-[1.65]">
                  {copy.lede}
                </p>

                <ul className="mt-8 flex max-w-xl flex-col gap-3">
                  {copy.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <IconCheck className="text-brass mt-0.5 h-5 w-5 shrink-0" />
                      <span className="text-dust text-[0.9375rem]">{point}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={site.phone.href}
                  data-cta={t.common.callNow}
                  data-cta-location={`lp-${campaign}`}
                  className="btn btn-brass mt-9"
                >
                  <IconPhone className="h-4.5 w-4.5" />
                  {site.phone.display}
                </a>

                <p className="u-label text-dust-2 mt-8 text-[0.5625rem] leading-[1.8] tracking-[0.14em]">
                  {[credentialLine(locale), t.landing.trustLine].filter(Boolean).join(' · ')}
                </p>

                <div className="mt-10">
                  <TestimonialGrid locale={locale} className="sm:grid-cols-1" />
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="glass-panel p-6 lg:p-8">
                  <h2 className="u-h3 text-[1.25rem]">{t.landing.formTitle}</h2>
                  <p className="u-meta mt-2">{t.landing.formLede}</p>
                  <QuoteForm
                    className="mt-6"
                    locale={locale}
                    variant="general"
                    defaultService={config.service}
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

          <footer className="u-wrap flex flex-wrap items-center justify-between gap-4 py-8">
            <p className="u-meta">
              © 2026 {t.meta.siteName}. {t.footer.rights}
            </p>
            <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link href={pagePath(locale, 'privacy')} className="link-rule text-[0.8125rem]">
                {t.footer.privacy}
              </Link>
              <Link href={pagePath(locale, 'home')} className="link-rule text-[0.8125rem]">
                {t.landing.backToSite}
              </Link>
            </span>
          </footer>
        </main>
        <Recaptcha />
      </body>
    </html>
  );
}
