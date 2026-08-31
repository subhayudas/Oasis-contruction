import { FaqAccordion } from '@/components/FaqAccordion';
import { SectionHeading } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import { homeFaq } from '@/content/faq';
import { fill } from '@/content/placeholders';
import type { Locale } from '@/lib/i18n';

export function Faq({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const items = homeFaq[locale].map((item) => ({ q: item.q, a: fill(item.a) }));

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
      </div>
    </section>
  );
}
