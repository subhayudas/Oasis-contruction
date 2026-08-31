import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';

import '../globals.css';

import { Analytics, GtmNoScript } from '@/components/Analytics';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { CookieBanner } from '@/components/CookieBanner';
import { Footer } from '@/components/Footer';
import { GuidedFormProvider } from '@/components/guided/GuidedFormProvider';
import { Header } from '@/components/Header';
import { MobileContactBar } from '@/components/MobileContactBar';
import { Recaptcha } from '@/components/Recaptcha';
import { RevealScript } from '@/components/Reveal';
import { getDictionary } from '@/content/dictionary';
import { site } from '@/content/site';
import { geist, instrumentSerif } from '@/lib/fonts';
import { htmlLang, isLocale, locales } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';
import { BASE_URL, localBusinessJsonLd, websiteJsonLd } from '@/lib/seo';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: site.name,
  authors: [{ name: site.name, url: BASE_URL }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { telephone: true, address: false, email: true },
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    apple: [{ url: '/apple-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getDictionary(locale);

  return (
    <html lang={htmlLang[locale]} className={`${geist.variable} ${instrumentSerif.variable}`}>
      <head>
        {/* Runs before the first paint so a visitor who dismissed the
            announcement never sees it flash in and shove the page down.
            Deliberately tiny, synchronous and dependency-free — anything
            slower than this would delay the paint it exists to protect. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('oasis_announcement_dismissed')==='1')document.documentElement.dataset.announcement='hidden'}catch(e){}`,
          }}
        />
      </head>
      <body>
        <GtmNoScript />

        <a
          href="#main"
          className="sr-only-focusable btn btn-stone absolute top-3 left-3 z-[70]"
        >
          {t.common.skipToContent}
        </a>

        {/* The page's own scroll state, read once by the observer in
            <RevealScript> and consumed entirely in CSS: while this is on
            screen the header is still sitting on unscrolled page. */}
        <div
          aria-hidden="true"
          data-sentinel="top"
          className="pointer-events-none absolute top-0 left-0 h-2 w-px"
        />

        <GuidedFormProvider locale={locale}>
          <AnnouncementBar
            text={t.announcement.text}
            cta={t.announcement.cta}
            href={pagePath(locale, 'contact')}
            dismissLabel={t.announcement.dismiss}
          />

          <Header locale={locale} />

          <main id="main" tabIndex={-1}>
            {children}
          </main>

          <Footer locale={locale} />
          <MobileContactBar locale={locale} />
        </GuidedFormProvider>

        <RevealScript />
        <Analytics />
        <Recaptcha />

        <CookieBanner
          labels={{
            title: t.cookies.title,
            body: t.cookies.body,
            accept: t.cookies.accept,
            refuse: t.cookies.refuse,
            link: t.cookies.link,
            label: t.cookies.label,
          }}
          privacyHref={pagePath(locale, 'privacy')}
        />

        <script
          type="application/ld+json"
          // JSON-LD built entirely from src/content/site.ts — verified facts only.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([localBusinessJsonLd(locale), websiteJsonLd(locale)]),
          }}
        />
      </body>
    </html>
  );
}
