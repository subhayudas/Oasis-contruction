import Link from 'next/link';

import { services } from '@/content/services';
import { site } from '@/content/site';
import { pagePath, servicePath } from '@/lib/routes';
import { IconArrow } from '@/components/icons';

/**
 * not-found.tsx cannot read route params, so this page shows both languages
 * side by side rather than guessing which one the visitor wanted. Every link
 * below points at a real route in each language.
 */
export default function LocaleNotFound() {
  return (
    <section className="u-wrap u-section">
      <p className="u-label text-umber">404</p>
      <span className="u-tick mt-3.5" aria-hidden="true" />

      <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div lang="fr">
          <h1 className="u-h2">Cette page n’existe pas.</h1>
          <p className="u-lede mt-4 max-w-md">
            Le lien est peut-être brisé ou la page a été déplacée. Voici par où continuer.
          </p>
          <ul className="mt-7 flex flex-col">
            <li className="border-t border-[var(--line)]">
              <Link
                href={pagePath('fr', 'home')}
                className="group flex min-h-12 items-center justify-between gap-4 py-2.5"
              >
                Accueil
                <IconArrow className="text-ink-50 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
            {services.map((service) => (
              <li key={service.key} className="border-t border-[var(--line)]">
                <Link
                  href={servicePath('fr', service.key)}
                  className="group flex min-h-12 items-center justify-between gap-4 py-2.5"
                >
                  {service.copy.fr.name}
                  <IconArrow className="text-ink-50 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
            <li className="border-y border-[var(--line)]">
              <Link
                href={pagePath('fr', 'contact')}
                className="group flex min-h-12 items-center justify-between gap-4 py-2.5"
              >
                Contact
                <IconArrow className="text-ink-50 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          </ul>
          <Link href={pagePath('fr', 'home')} className="btn btn-stone mt-7">
            Retour à l’accueil
          </Link>
        </div>

        <div
          lang="en"
          className="border-t border-[var(--line-strong)] pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-16"
        >
          <h1 className="u-h2">This page does not exist.</h1>
          <p className="u-lede mt-4 max-w-md">
            The link may be broken, or the page may have moved. Here is where to pick up.
          </p>
          <ul className="mt-7 flex flex-col">
            <li className="border-t border-[var(--line)]">
              <Link
                href={pagePath('en', 'home')}
                className="group flex min-h-12 items-center justify-between gap-4 py-2.5"
              >
                Home
                <IconArrow className="text-ink-50 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
            {services.map((service) => (
              <li key={service.key} className="border-t border-[var(--line)]">
                <Link
                  href={servicePath('en', service.key)}
                  className="group flex min-h-12 items-center justify-between gap-4 py-2.5"
                >
                  {service.copy.en.name}
                  <IconArrow className="text-ink-50 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
            <li className="border-y border-[var(--line)]">
              <Link
                href={pagePath('en', 'contact')}
                className="group flex min-h-12 items-center justify-between gap-4 py-2.5"
              >
                Contact
                <IconArrow className="text-ink-50 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          </ul>
          <Link href={pagePath('en', 'home')} className="btn btn-stone mt-7">
            Back to the home page
          </Link>
        </div>
      </div>

      <p className="u-meta mt-14">
        <a href={site.phone.href} className="link-rule text-[0.8125rem]">
          {site.phone.display}
        </a>
        {' · '}
        <a href={site.email.href} className="link-rule text-[0.8125rem]">
          {site.email.display}
        </a>
      </p>
    </section>
  );
}
