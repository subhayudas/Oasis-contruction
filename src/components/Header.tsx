import Link from 'next/link';

import { getDictionary } from '@/content/dictionary';
import { services } from '@/content/services';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath, servicePath } from '@/lib/routes';
import { IconPhone } from './icons';
import { LocaleSwitch } from './LocaleSwitch';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { ServicesMenu } from './ServicesMenu';

/**
 * The phone number and the primary call to action are both in the bar on
 * every page and at every width above `md`, and the phone icon plus the
 * hamburger cover the two below it. Nothing about reaching Oasis is ever more
 * than one tap away, which is the single most load-bearing rule on the site.
 */
export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const navItems = [
    { href: pagePath(locale, 'projects'), label: t.nav.projects },
    { href: pagePath(locale, 'about'), label: t.nav.about },
    { href: pagePath(locale, 'contact'), label: t.nav.contact },
  ];

  /**
   * The sheet opens over the logo, so it needs a home link of its own - and
   * it has room for the service-area page that the desktop bar does not.
   */
  const mobileItems = [
    { href: pagePath(locale, 'home'), label: t.common.home },
    ...navItems,
    { href: pagePath(locale, 'areas'), label: t.nav.areas },
  ];

  const serviceItems = services.map((s) => ({
    href: servicePath(locale, s.key),
    label: s.copy[locale].name,
    description: s.copy[locale].short,
  }));

  const localeSwitch = (
    <LocaleSwitch
      locale={locale}
      groupLabel={t.common.language}
      switchLabel={t.common.switchTo}
    />
  );

  return (
    <header className="glass-bar sticky top-0 z-40">
      <div className="grain-overlay">
        <div className="u-wrap flex h-[4.25rem] items-center justify-between gap-4 lg:h-[4.75rem]">
          <Logo locale={locale} />

          {/* The inset tray: navigation set into the header like a recessed rail. */}
          <nav aria-label={t.common.menu} className="hidden lg:block">
            <ul className="s-tray flex items-center gap-0.5 rounded-lg px-1.5 py-1">
              <li>
                <ServicesMenu
                  label={t.nav.services}
                  href={pagePath(locale, 'services')}
                  openLabel={t.nav.servicesMenu}
                  items={serviceItems}
                />
              </li>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-quiet hover:text-brass-deep inline-flex min-h-11 items-center rounded-[1px] px-3.5 text-[0.875rem] font-[550] tracking-[-0.005em] transition-colors hover:bg-[rgba(255,255,255,0.75)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <div className="hidden lg:block">{localeSwitch}</div>

            <a
              href={site.phone.href}
              aria-label={`${t.common.callUs} : ${site.phone.display}`}
              data-cta={t.common.call}
              data-cta-location="header"
              className="link-quiet hidden min-h-11 items-center gap-2 px-1 text-[0.875rem] font-[550] md:inline-flex lg:px-2"
            >
              <IconPhone className="text-brass-deep h-4 w-4" />
              <span className="hidden xl:inline">{site.phone.display}</span>
              <span className="xl:hidden">{t.common.call}</span>
            </a>

            {/* On a phone the bar is too narrow for a labelled key, so the
                number becomes a 44px icon button and the quote CTA moves into
                the sheet and the pinned thumb bar. */}
            <a
              href={site.phone.href}
              aria-label={`${t.common.callUs} : ${site.phone.display}`}
              data-cta={t.common.call}
              data-cta-location="header-mobile"
              className="btn btn-brass btn-compact h-11 min-h-11 w-11 !px-0 md:hidden"
            >
              <IconPhone className="h-5 w-5" />
            </a>

            <Link
              href={pagePath(locale, 'contact')}
              data-cta={t.common.quoteShort}
              data-cta-location="header"
              className="btn btn-stone btn-compact hidden md:inline-flex"
            >
              {t.common.quoteShort}
            </Link>

            <MobileNav
              items={mobileItems}
              services={serviceItems}
              servicesLabel={t.nav.services}
              quote={{ href: pagePath(locale, 'contact'), label: t.common.quoteShort }}
              phone={{
                href: site.phone.href,
                display: site.phone.display,
                label: `${t.common.callUs} : ${site.phone.display}`,
              }}
              labels={{
                open: t.common.openMenu,
                close: t.common.closeMenu,
                menu: t.common.menu,
              }}
              localeSwitch={localeSwitch}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
