import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Eyebrow } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';

export function PrivacyPage({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="u-wrap pt-8 pb-24 lg:pt-12 lg:pb-28">
      <Breadcrumbs
        label={t.common.breadcrumb}
        items={[
          { name: t.common.home, path: pagePath(locale, 'home') },
          { name: t.footer.privacy, path: pagePath(locale, 'privacy') },
        ]}
      />

      <div className="mt-10 max-w-3xl">
        <Eyebrow>{t.privacyPage.eyebrow}</Eyebrow>
        <span className="u-tick mt-3.5" aria-hidden="true" />
        <h1 className="u-display mt-6">{t.privacyPage.title}</h1>
        <p className="u-meta mt-5">
          {t.privacyPage.updated} : {t.privacyPage.updatedValue}
        </p>

        <div className="mt-12 flex flex-col">
          {t.privacyPage.sections.map((section, index) => (
            <section key={section.title} className="border-t border-[var(--line)] py-8">
              <div className="grid gap-4 sm:grid-cols-[3rem_1fr] sm:gap-6">
                <span
                  className="u-label text-umber text-[0.625rem] tracking-[0.22em]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="u-h3 text-[1.25rem]">{section.title}</h2>
                  <div className="mt-4 flex flex-col gap-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="u-body">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="s-plaque mt-6 mb-16 px-5 py-4">
          <p className="u-body relative z-10 text-[0.9375rem]">
            {site.name} ·{' '}
            <a href={site.email.href} className="link-rule text-[0.9375rem]">
              {site.email.display}
            </a>{' '}
            ·{' '}
            <a href={site.phone.href} className="link-rule text-[0.9375rem]">
              {site.phone.display}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
