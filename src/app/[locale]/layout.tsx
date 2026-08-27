import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';

import '../globals.css';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { LanguageGate } from '@/components/LanguageGate';
import { MobileContactBar } from '@/components/MobileContactBar';
import { RevealScript } from '@/components/Reveal';
import { getDictionary } from '@/content/dictionary';
import { site } from '@/content/site';
import { geist, instrumentSerif } from '@/lib/fonts';
import { htmlLang, isLocale, locales, otherLocale } from '@/lib/i18n';
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
  themeColor: '#ffffff',
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
  // Both headings are rendered, this locale's first, so the dialog is legible
  // to a visitor who cannot read the language the proxy guessed.
  const other = getDictionary(otherLocale[locale]);

  return (
    <html lang={htmlLang[locale]} className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only-focusable btn btn-stone absolute top-3 left-3 z-[60] rounded-sm"
        >
          {t.common.skipToContent}
        </a>

        <Header locale={locale} />

        <main id="main" tabIndex={-1} className="pb-[5.25rem] md:pb-0">
          {children}
        </main>

        <Footer locale={locale} />
        <MobileContactBar locale={locale} />
        <RevealScript />

        <LanguageGate
          locale={locale}
          labels={{
            eyebrow: t.languageGate.eyebrow,
            titles: [t.languageGate.title, other.languageGate.title],
            note: t.languageGate.note,
            dismiss: t.languageGate.dismiss,
          }}
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
