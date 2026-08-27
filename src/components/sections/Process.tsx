import { Picture } from '@/components/Picture';
import { SectionHeading } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { sceneById } from '@/content/imagery';
import type { Locale } from '@/lib/i18n';
import { source } from '@/lib/images';

type Step = { step: string; title: string; text: string };

export function ProcessSteps({
  steps,
  tone = 'light',
  className = '',
}: {
  steps: Step[];
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <ol className={`grid gap-px sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {steps.map((step, index) => (
        <li
          key={step.step}
          className={`reveal relative border-t pt-6 sm:pt-7 ${
            dark ? 'border-[var(--line-dark)]' : 'border-[var(--line-strong)]'
          } ${index > 0 ? 'lg:pl-7' : ''} ${
            index > 0
              ? dark
                ? 'lg:border-l lg:border-l-[var(--line-dark)]'
                : 'lg:border-l'
              : ''
          }`}
          style={{ ['--reveal-delay' as string]: `${index * 70}ms` }}
        >
          <span
            className={`u-label block text-[0.6875rem] tracking-[0.24em] ${
              dark ? 'text-teal' : 'text-bronze'
            }`}
          >
            {step.step}
          </span>
          <h3 className={`u-h3 mt-4 ${dark ? 'text-paper' : ''}`}>{step.title}</h3>
          <p
            className={`mt-3 text-[0.9375rem] leading-[1.62] ${dark ? 'text-dust' : 'u-body'}`}
          >
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const scene = sceneById('scene-releve-niveau');

  return (
    <section className="u-section border-t border-[var(--line)]">
      <div className="u-wrap">
        <SectionHeading
          eyebrow={t.processSection.eyebrow}
          title={t.processSection.title}
          lede={t.processSection.lede}
        />

        {/* Step 01 in a single frame: the levels are read before anything is
            lifted. The band also gives the four steps something to sit under. */}
        <figure className="reveal mt-12">
          <div className="frame frame-keyline clip-notch-sm shadow-[0_2px_4px_rgb(var(--sh)/0.07),0_34px_50px_-44px_rgb(var(--sh)/0.75)]">
            <Picture
              alt={scene?.alt[locale] ?? ''}
              sizes="100vw"
              sources={[
                source('scene-releve-niveau', 'banner', '(min-width: 40rem)'),
                source('scene-releve-niveau', 'wide'),
              ]}
              imgClassName="h-full w-full object-cover"
            />
          </div>
          <figcaption className="u-meta mt-3 max-w-2xl">{scene?.caption[locale]}</figcaption>
        </figure>

        <ProcessSteps steps={t.processSection.steps} className="mt-12 lg:gap-x-7" />
      </div>
    </section>
  );
}
