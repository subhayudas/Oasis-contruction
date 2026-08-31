import { getDictionary } from '@/content/dictionary';
import {
  formatReviewDate,
  testimonialTranslations,
  testimonials,
  type Testimonial,
} from '@/content/testimonials';
import type { Locale } from '@/lib/i18n';
import { IconStar } from './icons';

function Stars({ label }: { label: string }) {
  return (
    <p className="text-brass-deep flex gap-0.5" aria-label={label}>
      {[0, 1, 2, 3, 4].map((i) => (
        <IconStar key={i} className="h-4 w-4" aria-hidden="true" />
      ))}
    </p>
  );
}

export function TestimonialCard({
  testimonial,
  locale,
  className = '',
}: {
  testimonial: Testimonial;
  locale: Locale;
  className?: string;
}) {
  const t = getDictionary(locale);
  // The quote is reproduced in the language it was written in. On the English
  // site a translation is offered underneath rather than substituted, so the
  // customer's own words are never quietly replaced with ours.
  const translation =
    locale !== testimonial.language ? testimonialTranslations[testimonial.id] : undefined;

  return (
    <figure className={`s-plaque flex h-full flex-col px-6 py-6 ${className}`}>
      <div className="relative z-10 flex flex-1 flex-col">
        <Stars label={t.testimonialsSection.ratingLabel} />
        <blockquote className="mt-4 flex-1">
          <p
            lang={testimonial.language}
            className="text-ink text-[1.0625rem] leading-[1.6] tracking-[-0.005em]"
          >
            {testimonial.quote}
          </p>
        </blockquote>
        {translation ? (
          <p className="u-meta mt-3 border-l-2 border-[var(--line-strong)] pl-3 italic">
            <span className="u-label mr-1.5 text-[0.5625rem] not-italic">
              {t.testimonialsSection.translationLabel}
            </span>
            {translation}
          </p>
        ) : null}
        <figcaption className="mt-5 flex items-baseline gap-2 border-t border-[var(--line)] pt-4">
          <span className="text-ink text-[0.9375rem] font-[560]">{testimonial.author}</span>
          <span className="u-meta">{formatReviewDate(testimonial.date, locale)}</span>
        </figcaption>
      </div>
    </figure>
  );
}

export function TestimonialGrid({
  locale,
  limit,
  className = '',
}: {
  locale: Locale;
  limit?: number;
  className?: string;
}) {
  const items = limit ? testimonials.slice(0, limit) : testimonials;
  return (
    <ul className={`grid gap-5 sm:grid-cols-2 ${className}`}>
      {items.map((testimonial) => (
        <li key={testimonial.id} className="reveal">
          <TestimonialCard testimonial={testimonial} locale={locale} />
        </li>
      ))}
    </ul>
  );
}
