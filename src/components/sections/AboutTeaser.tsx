import { Picture } from '@/components/Picture';
import { ArrowLink, Eyebrow } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath } from '@/lib/routes';

export function AboutTeaser({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const scene = sceneById('scene-cordeau-sable');

  return (
    <section className="bg-sand border-y border-[var(--line)]">
      <div className="grain-overlay">
        <div className="u-wrap u-section">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            {/* The picture arrives from the side it lives on and the text from
                the other, so the pair reads as one spread rather than two
                blocks that happened to rise together. */}
            <figure className="reveal reveal-l order-last lg:order-first lg:col-span-5">
              <div className="frame frame-keyline clip-notch-sm shadow-[0_4px_12px_rgba(26,22,16,0.15)]">
                <Picture
                  alt={scene?.alt[locale] ?? ''}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  sources={[
                    source('scene-cordeau-sable', 'portrait', '(min-width: 64rem)'),
                    source('scene-cordeau-sable', 'wide'),
                  ]}
                  imgClassName="w-full h-auto"
                />
              </div>
              <figcaption className="u-meta mt-3">{scene?.caption[locale]}</figcaption>
            </figure>

            <div
              className="reveal reveal-r lg:col-span-7 lg:pl-4"
              style={{ ['--reveal-delay' as string]: '90ms' }}
            >
              <Eyebrow>{t.aboutTeaser.eyebrow}</Eyebrow>
              <span className="u-tick mt-3.5" aria-hidden="true" />
              <h2 className="u-h2 mt-5">{t.aboutTeaser.title}</h2>
              <div className="mt-6 flex flex-col gap-4">
                {t.aboutTeaser.body.map((paragraph) => (
                  <p key={paragraph} className="u-body text-[1.0625rem]">
                    {paragraph}
                  </p>
                ))}
              </div>
              <ArrowLink href={pagePath(locale, 'about')} className="mt-8">
                {t.aboutTeaser.cta}
              </ArrowLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
