'use client';

import Link from 'next/link';

import { IconArrow, IconCheck, IconPhone } from '@/components/icons';
import type { GuidedCopy } from '@/content/guided';
import { fill } from '@/content/placeholders';
import { site } from '@/content/site';
import { testimonials } from '@/content/testimonials';
import type { Locale } from '@/lib/i18n';
import { pagePath } from '@/lib/routes';

/**
 * The screen the whole form exists to reach.
 *
 * It answers the three questions a visitor has the moment they let go of a
 * lead: did it arrive, what happens next, and what if I do not want to wait.
 * The callback window is a `{responseTime}` hole rather than an invented
 * number — a promise the business has not made is not ours to make, and a
 * missed one costs more than the vagueness does.
 *
 * The testimonial is one of the two the business has actually published,
 * reproduced verbatim. There is no third and no aggregate score.
 */
export function FormConfirmation({
  copy,
  locale,
  firstName,
  onClose,
}: {
  copy: GuidedCopy;
  locale: Locale;
  firstName: string;
  onClose?: () => void;
}) {
  const review = testimonials.find((entry) => entry.id === 'william-2025-05');

  return (
    <div role="status" className="panel-in flex flex-col">
      <span
        className="border-green-deep text-green-deep mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2"
        aria-hidden="true"
      >
        <IconCheck className="check-draw h-8 w-8" />
      </span>

      <h2 className="text-ink mt-6 text-center text-[clamp(1.375rem,4.6vw,1.75rem)] leading-[1.2] font-[700] tracking-[-0.022em]">
        {copy.confirmation.title(firstName)}
      </h2>
      <p className="u-body mx-auto mt-4 max-w-[32rem] text-center text-[0.9375rem]">
        {fill(copy.confirmation.body)}
      </p>

      <h3 className="u-label text-ink-50 mt-9 text-[0.5625rem] tracking-[0.16em]">
        {copy.confirmation.nextTitle}
      </h3>
      <ol className="mt-3.5 flex flex-col">
        {copy.confirmation.next.map((item, index) => (
          <li
            key={item}
            className="flex items-start gap-3 border-b border-[var(--line)] py-3 last:border-b-0"
          >
            <span
              className="bg-brass-deep text-paper mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.6875rem] font-[700]"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className="u-body text-[0.9375rem]">{item}</span>
          </li>
        ))}
      </ol>

      <h3 className="u-label text-ink-50 mt-8 text-[0.5625rem] tracking-[0.16em]">
        {copy.confirmation.waitTitle}
      </h3>
      <a
        href={site.phone.href}
        data-cta={copy.confirmation.callCta}
        data-cta-location="guided-confirmation"
        className="btn btn-brass mt-3 w-full"
      >
        <IconPhone className="h-4.5 w-4.5" />
        {copy.confirmation.callCta} : {site.phone.display}
      </a>

      {/* One published review, verbatim. If the id ever disappears from the
          verified list the section goes with it rather than falling back to
          whichever quote happens to be first. */}
      {review ? (
        <>
          <h3 className="u-label text-ink-50 mt-8 text-[0.5625rem] tracking-[0.16em]">
            {copy.confirmation.testimonialTitle}
          </h3>
          <figure className="bg-sand mt-3 rounded-xl border border-[var(--line)] px-4 py-4">
            <blockquote className="text-ink-80 font-serif text-[0.9375rem] italic">
              “{review.quote}”
            </blockquote>
            <figcaption className="u-meta mt-2.5">
              — {review.author}, {review.date.slice(0, 4)}
            </figcaption>
          </figure>
        </>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={pagePath(locale, 'projects')}
          className="link-rule min-h-11 text-[0.9375rem]"
        >
          {copy.confirmation.projectsCta}
          <IconArrow className="h-4 w-4" />
        </Link>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="link-rule text-ink-50 min-h-11 text-[0.875rem]"
          >
            {copy.confirmation.closeCta}
          </button>
        ) : null}
      </div>
    </div>
  );
}
