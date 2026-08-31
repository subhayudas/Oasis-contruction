import { OpenGuidedForm } from '@/components/guided/OpenGuidedForm';
import { TestimonialGrid } from '@/components/Testimonials';
import { SectionHeading } from '@/components/ui';
import { getDictionary } from '@/content/dictionary';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';

export function TestimonialsSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="bg-sand u-section border-y border-[var(--line)]">
      <div className="u-wrap">
        <SectionHeading
          eyebrow={t.testimonialsSection.eyebrow}
          title={t.testimonialsSection.title}
          lede={t.testimonialsSection.lede}
        />
        <TestimonialGrid locale={locale} className="mt-10 lg:grid-cols-2" />
        {/* Two reviews is not much social proof, and pretending otherwise
            would mean inventing the rest. Saying so is the honest version and
            costs less trust than a fabricated aggregate score. */}
        <p className="u-meta reveal mt-8 max-w-[46rem]">{t.testimonialsSection.collectNote}</p>
        <div className="reveal mt-8">
          <OpenGuidedForm
            href={pagePath(locale, 'contact')}
            label={t.common.quote}
            location="testimonials"
            className="btn btn-stone"
          />
        </div>
      </div>
    </section>
  );
}
