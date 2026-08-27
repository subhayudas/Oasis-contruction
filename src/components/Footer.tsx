import Link from 'next/link';

import { getDictionary } from '@/content/dictionary';
import { services } from '@/content/services';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath, servicePath } from '@/lib/routes';
import { IconClock, IconFacebook, IconInstagram, IconMail, IconPhone, IconPin } from './icons';

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const year = 2026;
  const hours = locale === 'fr' ? site.hours.displayFr : site.hours.displayEn;
  const area = locale === 'fr' ? 'Laval et Rive-Nord' : 'Laval and the North Shore';

  const navItems = [
    { href: pagePath(locale, 'services'), label: t.nav.services },
    { href: pagePath(locale, 'projects'), label: t.nav.projects },
    { href: pagePath(locale, 'about'), label: t.nav.about },
    { href: pagePath(locale, 'contact'), label: t.nav.contact },
  ];

  return (
    <footer className="s-ink on-ink relative pb-[5.25rem] md:pb-0">
      <div className="grain-overlay">
        <div className="u-wrap py-14 lg:py-18">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <img
                  src="/brand/oasis-logo-512.png"
                  alt=""
                  width={52}
                  height={52}
                  className="h-13 w-13 rounded-full ring-1 ring-white/25"
                  style={{ width: 52, height: 52 }}
                />
                <div>
                  <p className="text-paper text-[1rem] font-[560] tracking-[-0.01em]">
                    {t.meta.siteName}
                  </p>
                  <p className="u-accent text-teal mt-1 text-[1.0625rem]">{t.footer.tagline}</p>
                </div>
              </div>
              <p className="u-body text-dust mt-5 max-w-sm text-[0.9375rem]">
                {t.footer.description}
              </p>

              <div className="mt-6 flex items-center gap-2.5">
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={t.common.followInstagram}
                  className="s-tray-ink text-dust hover:text-teal inline-flex h-11 w-11 items-center justify-center rounded-sm transition-colors"
                >
                  <IconInstagram className="h-5 w-5" />
                </a>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label={t.common.followFacebook}
                  className="s-tray-ink text-dust hover:text-teal inline-flex h-11 w-11 items-center justify-center rounded-sm transition-colors"
                >
                  <IconFacebook className="h-5 w-5" />
                </a>
              </div>
            </div>

            <nav aria-label={t.footer.navTitle} className="lg:col-span-2">
              <h2 className="u-label text-teal">{t.footer.navTitle}</h2>
              <ul className="mt-4 flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-dust hover:text-paper inline-flex min-h-9 items-center text-[0.9375rem] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label={t.footer.servicesTitle} className="lg:col-span-3">
              <h2 className="u-label text-teal">{t.footer.servicesTitle}</h2>
              <ul className="mt-4 flex flex-col gap-1">
                {services.map((s) => (
                  <li key={s.key}>
                    <Link
                      href={servicePath(locale, s.key)}
                      className="text-dust hover:text-paper inline-flex min-h-9 items-center text-[0.9375rem] transition-colors"
                    >
                      {s.copy[locale].name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-3">
              <h2 className="u-label text-teal">{t.footer.contactTitle}</h2>
              <ul className="mt-4 flex flex-col gap-3 text-[0.9375rem]">
                <li>
                  <a
                    href={site.phone.href}
                    className="text-paper hover:text-teal inline-flex min-h-9 items-center gap-2.5 transition-colors"
                  >
                    <IconPhone className="text-dust-2 h-4 w-4 shrink-0" />
                    {site.phone.display}
                  </a>
                </li>
                <li>
                  <a
                    href={site.email.href}
                    className="text-paper hover:text-teal inline-flex min-h-9 items-center gap-2.5 break-all transition-colors"
                  >
                    <IconMail className="text-dust-2 h-4 w-4 shrink-0" />
                    {site.email.display}
                  </a>
                </li>
                <li className="text-dust flex items-start gap-2.5">
                  <IconPin className="text-dust-2 mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    {site.address.street}
                    <span className="text-dust-2 mt-0.5 block text-[0.8125rem]">{area}</span>
                  </span>
                </li>
                <li className="text-dust flex items-start gap-2.5">
                  <IconClock className="text-dust-2 mt-0.5 h-4 w-4 shrink-0" />
                  <span>{hours}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-dust-2 mt-12 flex flex-col gap-3 border-t border-[var(--line-dark)] pt-6 text-[0.8125rem] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {t.meta.siteName}. {t.footer.rights}
            </p>
            <Link
              href={pagePath(locale, 'privacy')}
              className="hover:text-paper inline-flex min-h-9 items-center transition-colors"
            >
              {t.footer.privacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
