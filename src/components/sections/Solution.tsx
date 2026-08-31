import Link from 'next/link';

import { Picture } from '@/components/Picture';
import { IconCheck } from '@/components/icons';
import { SectionHeading } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';
import { pagePath } from '@/lib/routes';

/**
 * The answer to the section above it: what Oasis does about the problem the
 * visitor has just seen named. Two columns on desktop, the photograph second
 * on a phone so the argument arrives before the illustration.
 */
export function Solution({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const scene = sceneById('scene-equipe-chantier');

  return (
    <section className="bg-sand u-section border-y border-[var(--line)]">
      <div className="u-wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            eyebrow={t.solutionSection.eyebrow}
            title={t.solutionSection.title}
            lede={t.solutionSection.body}
          />

          <ul className="reveal mt-8 flex flex-col gap-3">
            {t.solutionSection.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <IconCheck className="text-brass-deep mt-0.5 h-5 w-5 shrink-0" />
                <span className="u-body text-[0.9375rem]">{point}</span>
              </li>
            ))}
          </ul>

          <div className="reveal mt-9">
            <Link
              href={pagePath(locale, 'contact')}
              data-cta={t.common.quote}
              data-cta-location="solution"
              className="btn btn-stone"
            >
              {t.common.quote}
            </Link>
          </div>
        </div>

        <div className="reveal reveal-r">
          <div className="frame frame-keyline aspect-[4/3] shadow-[0_4px_12px_rgba(26,22,16,0.15)]">
            <Picture
              alt={scene?.alt[locale] ?? t.solutionSection.imageAlt}
              sizes="(min-width: 64rem) 44vw, 92vw"
              sources={[
                source('scene-equipe-chantier', 'wide', '(min-width: 64rem)'),
                source('scene-equipe-chantier', 'square'),
              ]}
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
          {scene ? <p className="u-meta mt-3">{scene.caption[locale]}</p> : null}
        </div>
      </div>
    </section>
  );
}
