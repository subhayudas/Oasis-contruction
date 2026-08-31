import { FaqAccordion } from '@/components/FaqAccordion';
import { OpenGuidedForm } from '@/components/guided/OpenGuidedForm';
import { SectionHeading } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { homeFaq } from '@/content/faq';
import { fillOrNull } from '@/content/placeholders';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';

export function Faq({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  /* A question whose answer is still a placeholder is left out rather than
     shown half-answered. */
  const items = homeFaq[locale]
    .map((item) => ({ q: item.q, a: fillOrNull(item.a) }))
    .filter((item): item is { q: string; a: string } => item.a !== null);

  return (
    <section className="u-section" id="faq">
      <div className="u-wrap">
        <SectionHeading
          eyebrow={t.faqSection.eyebrow}
          title={t.faqSection.title}
          lede={t.faqSection.lede}
        />
        <div className="reveal mt-10 max-w-[52rem]">
          <FaqAccordion items={items} />
        </div>
        <div className="reveal mt-8">
          <OpenGuidedForm
            href={pagePath(locale, 'contact')}
            label={t.common.quote}
            location="faq"
            className="btn btn-stone"
          />
        </div>
      </div>
    </section>
  );
}
