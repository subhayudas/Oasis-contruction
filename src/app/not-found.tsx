import Link from 'next/link';

import './globals.css';
import { geist, instrumentSerif } from '@/lib/fonts';
import { site } from '@/content/site';

/**
 * The document-level 404, for requests that never reach a locale segment.
 * It carries its own <html>/<body> because the root layout is a pass-through.
 */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body>
        <main className="u-wrap u-section">
          <p className="u-label text-umber">404</p>
          <span className="u-tick mt-3.5" aria-hidden="true" />
          <h1 className="u-h2 mt-6" lang="fr">
            Page introuvable
          </h1>
          <p className="u-h2 text-ink-50 mt-2" lang="en">
            Page not found
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/fr" className="btn btn-stone" hrefLang="fr" lang="fr">
              Accueil
            </Link>
            <Link href="/en" className="btn btn-quarry" hrefLang="en" lang="en">
              Home
            </Link>
          </div>
          <p className="u-meta mt-10">
            <a href={site.phone.href} className="link-rule text-[0.8125rem]">
              {site.phone.display}
            </a>
            {' · '}
            <a href={site.email.href} className="link-rule text-[0.8125rem]">
              {site.email.display}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
