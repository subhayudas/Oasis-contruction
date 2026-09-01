'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import type { Dictionary } from '@/content/dictionary';
import { fill } from '@/content/placeholders';
import { trackFormStart, trackFormSubmit, trackPhotoUpload } from '@/lib/analytics';
import {
  validateContact,
  validateFiles,
  type ContactErrorKey,
  type ContactPayload,
  type ContactResponse,
  type ContactVariant,
} from '@/lib/contact';
import { firstNameOf } from '@/lib/guided';
import { isLocale, defaultLocale } from '@/lib/i18n';
import { stashLead } from '@/lib/lead-handoff';
import { recaptchaToken } from '@/lib/recaptcha';
import { pagePath } from '@/lib/routes';
import { IconAlert, IconCheck } from './icons';
import { PhotoDropzone } from './PhotoDropzone';

type ServiceOption = { value: string; label: string };

type Props = {
  locale: string;
  /**
   * 'contact' on /contact - the written-enquiry form. 'general' is the older
   * name-and-number quote form, kept working but no longer placed anywhere:
   * the guided form replaced it everywhere it used to sit.
   */
  variant: Extract<ContactVariant, 'general' | 'contact'>;
  serviceOptions: ServiceOption[];
  /** Pre-selects the service on a service page. */
  defaultService?: string;
  privacyHref: string;
  phone: { href: string; display: string };
  email: { href: string; display: string };
  t: Dictionary;
  className?: string;
};

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; code: 'rate_limited' | 'failure' };

const EMPTY: ContactPayload = {
  name: '',
  email: '',
  phone: '',
  service: '',
  subject: '',
  city: '',
  message: '',
  duration: '',
  preferred: 'phone',
  consent: false,
  locale: 'fr',
  website: '',
  elapsed: 0,
};

/**
 * The lead form.
 *
 * Two required fields on the general variant - a name and a phone number -  * because every extra required field costs submissions, and everything else
 * on the list is a question that is faster to ask on the call than to type on
 * a phone. Address, budget and timeline are deliberately not collected.
 *
 * Validation is the same function the route handler runs, so the browser and
 * the server can never disagree about what a valid submission is.
 */
export function QuoteForm({
  locale,
  variant,
  serviceOptions,
  defaultService = '',
  privacyHref,
  phone,
  email,
  t,
  className = '',
}: Props) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  /* The floor on how fast a human can fill this in. Stamped on mount rather
     than during render - reading the clock while rendering is impure, and a
     re-render would move the start of the window. */
  const mountedAt = useRef<number | null>(null);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const started = useRef(false);

  const [values, setValues] = useState<ContactPayload>({
    ...EMPTY,
    locale,
    service: defaultService,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ContactErrorKey[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const isContact = variant === 'contact';
  const formType = isContact ? 'contact' : 'general';

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;
  const has = (key: ContactErrorKey) => showErrors && errors.includes(key);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackFormStart(formType);
  }

  function set<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) {
    markStarted();
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === 'submitting') return;

    const found = [...validateContact(values, variant), ...validateFiles(files, variant)];
    setErrors(found);
    setShowErrors(true);

    if (found.length > 0) {
      // Move focus to the summary so the problems are announced, then read.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus({ kind: 'submitting' });

    const body = new FormData();
    body.set('name', values.name);
    body.set('email', values.email);
    body.set('phone', values.phone);
    body.set('service', values.service);
    body.set('subject', values.subject);
    body.set('city', values.city);
    body.set('message', values.message);
    body.set('preferred', values.preferred);
    body.set('consent', String(values.consent));
    body.set('locale', values.locale);
    body.set('variant', variant);
    body.set('website', values.website);
    body.set('elapsed', String(mountedAt.current ? Date.now() - mountedAt.current : 0));
    body.set('recaptcha', await recaptchaToken('quote_form'));
    files.forEach((file) => body.append('photos', file));

    try {
      const response = await fetch('/api/contact', { method: 'POST', body });
      const data = (await response.json()) as ContactResponse;

      if (data.ok) {
        if (files.length > 0) trackPhotoUpload(files.length);

        /* Every lead the site produces lands on the same confirmation URL,
           whichever form made it, so an ad platform has one page to count.
           See lib/lead-handoff.ts for why it travels in sessionStorage. */
        const handed = stashLead({ formType, firstName: firstNameOf(values.name) });

        setStatus({ kind: 'success' });
        setValues({ ...EMPTY, locale, service: defaultService });
        setFiles([]);
        setShowErrors(false);
        formRef.current?.reset();

        if (handed) {
          // A real load, not a client transition: the tag has to see the URL.
          window.location.assign(pagePath(isLocale(locale) ? locale : defaultLocale, 'thanks'));
          return;
        }

        // Storage refused. The inline success panel above is still the truth,
        // so stay on it and count the lead here.
        trackFormSubmit(formType);
      } else if (data.code === 'validation' && data.errors) {
        setErrors(data.errors);
        setStatus({ kind: 'idle' });
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      } else if (data.code === 'rate_limited') {
        setStatus({ kind: 'error', code: 'rate_limited' });
      } else {
        // not_configured, delivery_failed and rejected all mean the same thing
        // to the visitor: this did not reach anyone, here is how to reach us.
        setStatus({ kind: 'error', code: 'failure' });
      }
    } catch {
      setStatus({ kind: 'error', code: 'failure' });
    }

    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.kind === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className={`panel-in s-plaque !border-l-green-deep border-l-2 px-6 py-7 ${className}`}
      >
        <p className="relative z-10 flex items-center gap-2.5">
          <IconCheck className="check-draw text-green-deep h-6 w-6 shrink-0" />
          <span className="u-h3">{t.form.successTitle}</span>
        </p>
        <p className="u-body relative z-10 mt-3 text-[0.9375rem]">{fill(t.form.successBody)}</p>
        <p className="relative z-10 mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
          <a href={phone.href} className="link-rule">
            {phone.display}
          </a>
          <a href={email.href} className="link-rule break-all">
            {email.display}
          </a>
        </p>
      </div>
    );
  }

  const fieldError = (key: ContactErrorKey) =>
    has(key) ? (
      <p id={errorId(key)} className="mt-1.5 text-[0.8125rem] text-[var(--color-danger-deep)]">
        {t.form.errors[key]}
      </p>
    ) : null;

  const labelCls = 'u-label mb-2 block text-[0.625rem] tracking-[0.16em] text-ink-70';
  const req = <span className="text-brass-deep">&nbsp;*</span>;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className={`flex flex-col gap-6 ${className}`}
    >
      {/* Bot trap: off-screen, never announced, never tabbable. */}
      <div aria-hidden="true" className="sr-only-focusable pointer-events-none absolute">
        <label htmlFor={fieldId('website')}>Website</label>
        <input
          id={fieldId('website')}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => set('website', event.target.value)}
        />
      </div>

      {showErrors && errors.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="panel-in s-plaque border-l-2 !border-l-[var(--color-danger-deep)] px-5 py-4"
        >
          <p className="relative z-10 flex items-center gap-2.5 text-[0.9375rem] font-[550]">
            <IconAlert className="h-5 w-5 shrink-0 text-[var(--color-danger-deep)]" />
            {t.form.errorSummary}
          </p>
          <ul className="relative z-10 mt-2.5 flex list-disc flex-col gap-1 pl-5 text-[0.875rem]">
            {errors.map((key) => (
              <li key={key}>
                <a href={`#${fieldId(key)}`} className="link-rule text-[0.875rem]">
                  {t.form.errors[key]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {status.kind === 'error' ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="panel-in s-plaque border-l-2 !border-l-[var(--color-danger-deep)] px-5 py-4"
        >
          <p className="relative z-10 text-[0.9375rem] font-[550]">
            {status.code === 'rate_limited' ? t.form.rateLimitTitle : t.form.failureTitle}
          </p>
          <p className="u-body relative z-10 mt-2 text-[0.875rem]">
            {status.code === 'rate_limited' ? t.form.rateLimitBody : t.form.failureBody}
          </p>
          <p className="relative z-10 mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.875rem]">
            <a href={phone.href} className="link-rule text-[0.875rem]">
              {phone.display}
            </a>
            <a href={email.href} className="link-rule text-[0.875rem] break-all">
              {email.display}
            </a>
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className={isContact ? '' : 'sm:col-span-2'}>
          <label htmlFor={fieldId('name')} className={labelCls}>
            {t.form.name}
            {req}
          </label>
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={t.form.namePlaceholder}
            value={values.name}
            onChange={(event) => set('name', event.target.value)}
            aria-invalid={has('name')}
            aria-describedby={has('name') ? errorId('name') : undefined}
            className="field"
          />
          {fieldError('name')}
        </div>

        <div>
          <label htmlFor={fieldId('phone')} className={labelCls}>
            {t.form.phone}
            {req}
          </label>
          <input
            id={fieldId('phone')}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder={t.form.phonePlaceholder}
            value={values.phone}
            onChange={(event) => set('phone', event.target.value)}
            aria-invalid={has('phone')}
            aria-describedby={has('phone') ? errorId('phone') : undefined}
            className="field"
          />
          {fieldError('phone')}
        </div>

        <div className={isContact ? 'sm:col-span-2' : ''}>
          <label htmlFor={fieldId('email')} className={labelCls}>
            {t.form.email}
            {isContact ? req : <span className="text-ink-50"> ({t.form.optional})</span>}
          </label>
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required={isContact}
            placeholder={t.form.emailPlaceholder}
            value={values.email}
            onChange={(event) => set('email', event.target.value)}
            aria-invalid={has('email')}
            aria-describedby={has('email') ? errorId('email') : undefined}
            className="field"
          />
          {fieldError('email')}
        </div>

        {isContact ? (
          <div className="sm:col-span-2">
            <label htmlFor={fieldId('subject')} className={labelCls}>
              {t.form.subject}
              {req}
            </label>
            <select
              id={fieldId('subject')}
              name="subject"
              required
              value={values.subject}
              onChange={(event) => set('subject', event.target.value)}
              aria-invalid={has('subject')}
              aria-describedby={has('subject') ? errorId('subject') : undefined}
              className="field"
            >
              <option value="">{t.form.subjectPlaceholder}</option>
              <option value="quote">{t.form.subjectQuote}</option>
              <option value="question">{t.form.subjectQuestion}</option>
              <option value="other">{t.form.subjectOther}</option>
            </select>
            {fieldError('subject')}
          </div>
        ) : (
          <div className="sm:col-span-2">
            <label htmlFor={fieldId('service')} className={labelCls}>
              {t.form.service} <span className="text-ink-50">({t.form.optional})</span>
            </label>
            <select
              id={fieldId('service')}
              name="service"
              value={values.service}
              onChange={(event) => set('service', event.target.value)}
              className="field"
            >
              <option value="">{t.form.servicePlaceholder}</option>
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
              <option value="other">{t.form.serviceOther}</option>
            </select>
          </div>
        )}

        {!isContact ? (
          <div className="sm:col-span-2">
            <label htmlFor={fieldId('photos')} className={labelCls}>
              {t.form.photos} <span className="text-ink-50">({t.form.optional})</span>
            </label>
            <PhotoDropzone
              id={fieldId('photos')}
              files={files}
              onChange={(next) => {
                markStarted();
                setFiles(next);
              }}
              describedBy={`${fieldId('photos')}-help`}
              invalid={has('fileCount') || has('fileSize') || has('fileType')}
              labels={{
                drop: t.form.photosDrop,
                help: t.form.photosHelp,
                remove: t.form.photosRemove,
                previewLabel: t.form.photosPreviewLabel,
              }}
            />
            <p id={`${fieldId('photos')}-help`} className="sr-only">
              {t.form.photosHelp}
            </p>
            {fieldError('fileCount')}
            {fieldError('fileSize')}
            {fieldError('fileType')}
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <label htmlFor={fieldId('message')} className={labelCls}>
            {isContact ? t.form.message : t.form.messageProject}
            {isContact ? req : <span className="text-ink-50"> ({t.form.optional})</span>}
          </label>
          <textarea
            id={fieldId('message')}
            name="message"
            rows={isContact ? 6 : 4}
            required={isContact}
            placeholder={t.form.messagePlaceholder}
            value={values.message}
            onChange={(event) => set('message', event.target.value)}
            aria-invalid={has('message')}
            aria-describedby={has('message') ? errorId('message') : undefined}
            className="field resize-y"
          />
          {fieldError('message')}
        </div>
      </div>

      <div>
        <label
          htmlFor={fieldId('consent')}
          className="text-ink-70 flex cursor-pointer items-start gap-3 py-1 text-[0.875rem] leading-[1.55]"
        >
          <input
            id={fieldId('consent')}
            name="consent"
            type="checkbox"
            required
            checked={values.consent}
            onChange={(event) => set('consent', event.target.checked)}
            aria-invalid={has('consent')}
            aria-describedby={has('consent') ? errorId('consent') : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-brass-deep)]"
          />
          <span>
            {t.form.consent}{' '}
            <Link href={privacyHref} className="link-rule text-[0.875rem]">
              {t.form.consentLink}
            </Link>
          </span>
        </label>
        {fieldError('consent')}
      </div>

      <p className="u-meta">{t.form.privacyNote}</p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={status.kind === 'submitting'}
          data-cta={t.form.submit}
          data-cta-location={isContact ? 'contact-form' : 'quote-form'}
          className="btn btn-stone w-full disabled:cursor-progress sm:w-auto"
        >
          {status.kind === 'submitting' ? (
            <>
              {/* A form that has gone quiet is indistinguishable from one that
                  has failed. The spinner is decoration for the eye only - the
                  label already carries the state for a screen reader. */}
              <span className="spinner" aria-hidden="true" />
              {t.form.submitting}
            </>
          ) : (
            t.form.submit
          )}
        </button>
        <a href={phone.href} className="link-rule min-h-11 text-[0.875rem]">
          {phone.display}
        </a>
      </div>
    </form>
  );
}
