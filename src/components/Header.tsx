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

export function Header({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  const navItems = [
    { href: pagePath(locale, 'services'), label: t.nav.services },
    { href: pagePath(locale, 'projects'), label: t.nav.projects },
    { href: pagePath(locale, 'about'), label: t.nav.about },
    { href: pagePath(locale, 'contact'), label: t.nav.contact },
  ];

  const serviceItems = services.map((s) => ({
    href: servicePath(locale, s.key),
    label: s.copy[locale].name,
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
            <ul className="s-tray flex items-center gap-0.5 rounded-sm px-1.5 py-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-quiet hover:text-teal-deep inline-flex min-h-9 items-center rounded-[1px] px-3.5 text-[0.875rem] font-[550] tracking-[-0.005em] transition-colors hover:bg-[rgba(255,255,255,0.75)]"
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
              className="link-quiet hidden min-h-11 items-center gap-2 px-1 text-[0.875rem] font-[550] md:inline-flex lg:px-2"
            >
              <IconPhone className="text-teal-deep h-4 w-4" />
              <span className="hidden xl:inline">{site.phone.display}</span>
              <span className="xl:hidden">{t.common.call}</span>
            </a>

            <Link
              href={pagePath(locale, 'contact')}
              className="btn btn-stone hidden rounded-sm md:inline-flex"
            >
              {t.common.quote}
            </Link>

            <MobileNav
              items={navItems}
              services={serviceItems}
              servicesLabel={t.nav.services}
              quote={{ href: pagePath(locale, 'contact'), label: t.common.quote }}
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
