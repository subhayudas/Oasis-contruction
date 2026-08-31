'use client';

import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';

import type { GuidedCopy } from '@/content/guided';
import { IconAlert } from '@/components/icons';
import type { GuidedFieldError, GuidedSubmitError } from '@/lib/guided';

type Props = {
  copy: GuidedCopy;
  name: string;
  phone: string;
  email: string;
  errors: GuidedFieldError[];
  showErrors: boolean;
  submitting: boolean;
  submitError: GuidedSubmitError | null;
  privacyHref: string;
  phoneLink: { href: string; display: string };
  /** The recap of what was tapped, so the last screen is not a blank form. */
  summary: string[];
  onChange: (field: GuidedFieldError, value: string) => void;
  onFocusFirst: () => void;
  onSubmit: () => void;
};

/**
 * Step 6, and the only screen with a keyboard on it.
 *
 * Two fields are required, and they are the two the business actually works
 * from: a name and a number. Email is offered and never demanded, because
 * Oasis calls people — requiring an address here would cost submissions to
 * collect a field nobody uses.
 *
 * The recap above the fields is deliberate: after five taps the visitor has
 * told us a great deal and seen none of it repeated back. Showing it makes
 * the last screen feel like the end of a conversation rather than the start
 * of a form.
 */
export function StepContact({
  copy,
  name,
  phone,
  email,
  errors,
  showErrors,
  submitting,
  submitError,
  privacyHref,
  phoneLink,
  summary,
  onChange,
  onFocusFirst,
  onSubmit,
}: Props) {
  const uid = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    // Autofocus the first field so the keyboard is already up when the
    // screen settles — on a phone that is one fewer tap on the last step,
    // which is the step where abandonment is most expensive.
    nameRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (submitError) alertRef.current?.focus();
  }, [submitError]);

  const has = (key: GuidedFieldError) => showErrors && errors.includes(key);
  const errorId = (key: string) => `${uid}-${key}-error`;
  const labelCls = 'u-label text-ink-70 mb-2 block text-[0.625rem] tracking-[0.16em]';

  function markStarted() {
    if (started.current) return;
    started.current = true;
    onFocusFirst();
  }

  const failure =
    submitError === 'offline'
      ? { title: copy.contact.offlineTitle, body: copy.contact.offlineBody }
      : submitError === 'rate_limited'
        ? { title: copy.contact.rateLimitTitle, body: copy.contact.rateLimitBody }
        : submitError
          ? { title: copy.contact.failureTitle, body: copy.contact.failureBody }
          : null;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <header>
        <h2 className="text-ink text-[clamp(1.375rem,4.6vw,1.625rem)] leading-[1.2] font-[700] tracking-[-0.02em]">
          {copy.contact.question}
        </h2>
        <p className="u-body mt-2.5 text-[0.9375rem]">{copy.contact.hint}</p>
      </header>

      {summary.length > 0 ? (
        <div className="s-plaque px-4 py-3.5">
          <p className="u-label text-ink-50 relative z-10 text-[0.5625rem] tracking-[0.16em]">
            {copy.summaryLabel}
          </p>
          <p className="text-ink-80 relative z-10 mt-1.5 text-[0.875rem] leading-[1.5]">
            {summary.join(' · ')}
          </p>
        </div>
      ) : null}

      {failure ? (
        <div
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="panel-in s-plaque border-l-2 !border-l-[var(--color-danger-deep)] px-4 py-3.5"
        >
          <p className="relative z-10 flex items-center gap-2.5 text-[0.9375rem] font-[550]">
            <IconAlert className="h-5 w-5 shrink-0 text-[var(--color-danger-deep)]" />
            {failure.title}
          </p>
          <p className="u-body relative z-10 mt-2 text-[0.875rem]">{failure.body}</p>
          <p className="relative z-10 mt-2.5">
            <a href={phoneLink.href} className="link-rule text-[0.875rem]">
              {phoneLink.display}
            </a>
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor={`${uid}-name`} className={labelCls}>
            {copy.contact.name}
            <span className="text-brass-deep">&nbsp;*</span>
          </label>
          <input
            ref={nameRef}
            id={`${uid}-name`}
            type="text"
            inputMode="text"
            autoComplete="name"
            enterKeyHint="next"
            placeholder={copy.contact.namePlaceholder}
            value={name}
            onFocus={markStarted}
            onChange={(event) => onChange('name', event.target.value)}
            aria-invalid={has('name')}
            aria-describedby={has('name') ? errorId('name') : undefined}
            className="field"
          />
          {has('name') ? (
            <p
              id={errorId('name')}
              role="alert"
              className="mt-1.5 text-[0.8125rem] text-[var(--color-danger-deep)]"
            >
              {copy.contact.errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-phone`} className={labelCls}>
            {copy.contact.phone}
            <span className="text-brass-deep">&nbsp;*</span>
          </label>
          <input
            id={`${uid}-phone`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            placeholder={copy.contact.phonePlaceholder}
            value={phone}
            onFocus={markStarted}
            onChange={(event) => onChange('phone', event.target.value)}
            aria-invalid={has('phone')}
            aria-describedby={has('phone') ? errorId('phone') : undefined}
            className="field"
          />
          {has('phone') ? (
            <p
              id={errorId('phone')}
              role="alert"
              className="mt-1.5 text-[0.8125rem] text-[var(--color-danger-deep)]"
            >
              {copy.contact.errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${uid}-email`} className={labelCls}>
            {copy.contact.email}
            <span className="text-ink-50"> ({copy.contact.optional})</span>
          </label>
          <input
            id={`${uid}-email`}
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="send"
            placeholder={copy.contact.emailPlaceholder}
            value={email}
            onFocus={markStarted}
            onChange={(event) => onChange('email', event.target.value)}
            aria-invalid={has('email')}
            aria-describedby={has('email') ? errorId('email') : undefined}
            className="field"
          />
          {has('email') ? (
            <p
              id={errorId('email')}
              role="alert"
              className="mt-1.5 text-[0.8125rem] text-[var(--color-danger-deep)]"
            >
              {copy.contact.errors.email}
            </p>
          ) : null}
        </div>
      </div>

      {/* The consent notice sits above the key it applies to: Law 25 asks for
          a real choice, and a choice cannot be made after the action. */}
      <p className="u-meta text-[0.8125rem] leading-[1.55]">
        {copy.contact.consent}{' '}
        <Link href={privacyHref} className="link-rule text-[0.8125rem]">
          {copy.contact.consentLink}
        </Link>
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-stone w-full disabled:cursor-progress"
      >
        {submitting ? (
          <>
            <span className="spinner" aria-hidden="true" />
            {copy.contact.submitting}
          </>
        ) : (
          copy.contact.submit
        )}
      </button>

      <p className="u-meta text-center text-[0.75rem]">{copy.contact.privacy}</p>
    </form>
  );
}
