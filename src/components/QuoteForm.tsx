'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';

import { IconAlert, IconCheck } from './icons';
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILES,
  validateContact,
  validateFiles,
  type ContactErrorKey,
  type ContactPayload,
  type ContactResponse,
  type ContactVariant,
} from '@/lib/contact';

type ServiceOption = { value: string; label: string };

type Props = {
  locale: string;
  variant?: ContactVariant;
  serviceOptions: ServiceOption[];
  /** Pre-selects the service on a service page. */
  defaultService?: string;
  privacyHref: string;
  phone: { href: string; display: string };
  email: { href: string; display: string };
  labels: {
    legendContact: string;
    legendProject: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    service: string;
    servicePlaceholder: string;
    serviceOther: string;
    city: string;
    cityPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    photos: string;
    photosHelp: string;
    photosSelected: string;
    preferred: string;
    preferredPhone: string;
    preferredEmail: string;
    preferredEither: string;
    consent: string;
    consentLink: string;
    submit: string;
    submitting: string;
    optional: string;
    required: string;
    errorSummary: string;
    errors: Record<ContactErrorKey, string>;
    successTitle: string;
    successBody: string;
    failureTitle: string;
    failureBody: string;
    rateLimitTitle: string;
    rateLimitBody: string;
  };
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
  city: '',
  message: '',
  preferred: 'either',
  consent: false,
  locale: 'fr',
  website: '',
  elapsed: 0,
};

export function QuoteForm({
  locale,
  variant = 'full',
  serviceOptions,
  defaultService = '',
  privacyHref,
  phone,
  email,
  labels,
  className = '',
}: Props) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef<number>(Date.now());

  const [values, setValues] = useState<ContactPayload>({
    ...EMPTY,
    locale,
    service: defaultService,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ContactErrorKey[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;
  const has = (key: ContactErrorKey) => showErrors && errors.includes(key);

  function set<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === 'submitting') return;

    const found = [...validateContact(values, variant), ...validateFiles(files)];
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
    body.set('city', values.city);
    body.set('message', values.message);
    body.set('preferred', values.preferred);
    body.set('consent', String(values.consent));
    body.set('locale', values.locale);
    body.set('variant', variant);
    body.set('website', values.website);
    body.set('elapsed', String(Date.now() - mountedAt.current));
    files.forEach((file) => body.append('photos', file));

    try {
      const response = await fetch('/api/contact', { method: 'POST', body });
      const data = (await response.json()) as ContactResponse;

      if (data.ok) {
        setStatus({ kind: 'success' });
        setValues({ ...EMPTY, locale, service: defaultService });
        setFiles([]);
        setShowErrors(false);
        formRef.current?.reset();
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

  const isFull = variant === 'full';

  if (status.kind === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className={`panel-in s-plaque !border-l-green-deep border-l-2 px-6 py-7 ${className}`}
      >
        <p className="relative z-10 flex items-center gap-2.5">
          <IconCheck className="check-draw text-green-deep h-5 w-5 shrink-0" />
          <span className="u-h3">{labels.successTitle}</span>
        </p>
        <p className="u-body relative z-10 mt-3 text-[0.9375rem]">{labels.successBody}</p>
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
      <p id={errorId(key)} className="mt-1.5 text-[0.8125rem] text-[#b42318]">
        {labels.errors[key]}
      </p>
    ) : null;

  const labelCls = 'u-label mb-2 block text-[0.625rem] tracking-[0.16em] text-ink-70';

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
          className="panel-in s-plaque border-l-2 !border-l-[#b42318] px-5 py-4"
        >
          <p className="relative z-10 flex items-center gap-2.5 text-[0.9375rem] font-[550]">
            <IconAlert className="h-4.5 w-4.5 shrink-0 text-[#b42318]" />
            {labels.errorSummary}
          </p>
          <ul className="relative z-10 mt-2.5 flex list-disc flex-col gap-1 pl-5 text-[0.875rem]">
            {errors.map((key) => (
              <li key={key}>
                <a href={`#${fieldId(key)}`} className="link-rule text-[0.875rem]">
                  {labels.errors[key]}
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
          className="panel-in s-plaque border-l-2 !border-l-[#b42318] px-5 py-4"
        >
          <p className="relative z-10 text-[0.9375rem] font-[550]">
            {status.code === 'rate_limited' ? labels.rateLimitTitle : labels.failureTitle}
          </p>
          <p className="u-body relative z-10 mt-2 text-[0.875rem]">
            {status.code === 'rate_limited' ? labels.rateLimitBody : labels.failureBody}
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

      <fieldset className="m-0 border-0 p-0">
        <legend className="u-label text-bronze mb-4">{labels.legendContact}</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={fieldId('name')} className={labelCls}>
              {labels.name} <span className="text-ink-50">({labels.required})</span>
            </label>
            <input
              id={fieldId('name')}
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder={labels.namePlaceholder}
              value={values.name}
              onChange={(event) => set('name', event.target.value)}
              aria-invalid={has('name')}
              aria-describedby={has('name') ? errorId('name') : undefined}
              className="field"
            />
            {fieldError('name')}
          </div>

          <div>
            <label htmlFor={fieldId('email')} className={labelCls}>
              {labels.email}
            </label>
            <input
              id={fieldId('email')}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={labels.emailPlaceholder}
              value={values.email}
              onChange={(event) => set('email', event.target.value)}
              aria-invalid={has('email') || has('contact')}
              aria-describedby={
                has('email')
                  ? errorId('email')
                  : has('contact')
                    ? errorId('contact')
                    : undefined
              }
              className="field"
            />
            {fieldError('email')}
          </div>

          <div>
            <label htmlFor={fieldId('phone')} className={labelCls}>
              {labels.phone}
            </label>
            <input
              id={fieldId('phone')}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={labels.phonePlaceholder}
              value={values.phone}
              onChange={(event) => set('phone', event.target.value)}
              aria-invalid={has('phone') || has('contact')}
              aria-describedby={has('phone') ? errorId('phone') : undefined}
              className="field"
            />
            {fieldError('phone')}
          </div>

          {has('contact') ? (
            <p
              id={errorId('contact')}
              className="text-[0.8125rem] text-[#b42318] sm:col-span-2"
            >
              {labels.errors.contact}
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className="u-label text-bronze mb-4">{labels.legendProject}</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          {isFull ? (
            <>
              <div>
                <label htmlFor={fieldId('service')} className={labelCls}>
                  {labels.service} <span className="text-ink-50">({labels.required})</span>
                </label>
                <select
                  id={fieldId('service')}
                  name="service"
                  required
                  value={values.service}
                  onChange={(event) => set('service', event.target.value)}
                  aria-invalid={has('service')}
                  aria-describedby={has('service') ? errorId('service') : undefined}
                  className="field"
                >
                  <option value="">{labels.servicePlaceholder}</option>
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                  <option value="other">{labels.serviceOther}</option>
                </select>
                {fieldError('service')}
              </div>

              <div>
                <label htmlFor={fieldId('city')} className={labelCls}>
                  {labels.city} <span className="text-ink-50">({labels.required})</span>
                </label>
                <input
                  id={fieldId('city')}
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  required
                  placeholder={labels.cityPlaceholder}
                  value={values.city}
                  onChange={(event) => set('city', event.target.value)}
                  aria-invalid={has('city')}
                  aria-describedby={has('city') ? errorId('city') : undefined}
                  className="field"
                />
                {fieldError('city')}
              </div>
            </>
          ) : null}

          <div className="sm:col-span-2">
            <label htmlFor={fieldId('message')} className={labelCls}>
              {labels.message} <span className="text-ink-50">({labels.required})</span>
            </label>
            <textarea
              id={fieldId('message')}
              name="message"
              rows={isFull ? 5 : 4}
              required
              placeholder={labels.messagePlaceholder}
              value={values.message}
              onChange={(event) => set('message', event.target.value)}
              aria-invalid={has('message')}
              aria-describedby={has('message') ? errorId('message') : undefined}
              className="field resize-y"
            />
            {fieldError('message')}
          </div>

          {isFull ? (
            <>
              <div className="sm:col-span-2">
                <label htmlFor={fieldId('photos')} className={labelCls}>
                  {labels.photos} <span className="text-ink-50">({labels.optional})</span>
                </label>
                <input
                  id={fieldId('photos')}
                  name="photos"
                  type="file"
                  multiple
                  accept={`${ACCEPTED_IMAGE_TYPES.join(',')},${ACCEPTED_EXTENSIONS}`}
                  onChange={(event) =>
                    setFiles(Array.from(event.target.files ?? []).slice(0, MAX_FILES + 1))
                  }
                  aria-invalid={has('fileType') || has('fileSize') || has('fileCount')}
                  aria-describedby={`${fieldId('photos')}-help`}
                  className="field file:text-teal-deep h-auto cursor-pointer py-2.5 file:mr-3 file:cursor-pointer file:rounded-sm file:border file:border-[color-mix(in_oklab,var(--color-teal-deep)_28%,transparent)] file:bg-gradient-to-b file:from-white file:to-[#e2ecf9] file:px-3 file:py-1.5 file:text-[0.8125rem] file:font-[550]"
                />
                <p id={`${fieldId('photos')}-help`} className="u-meta mt-1.5">
                  {labels.photosHelp}
                  {files.length > 0 ? ` — ${files.length} ${labels.photosSelected}` : ''}
                </p>
                {fieldError('fileCount')}
                {fieldError('fileSize')}
                {fieldError('fileType')}
              </div>

              <fieldset className="m-0 border-0 p-0 sm:col-span-2">
                <legend className={labelCls}>{labels.preferred}</legend>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ['phone', labels.preferredPhone],
                      ['email', labels.preferredEmail],
                      ['either', labels.preferredEither],
                    ] as const
                  ).map(([value, label]) => (
                    <label
                      key={value}
                      className={`btn rounded-sm ${
                        values.preferred === value ? 'btn-stone' : 'btn-quarry'
                      }`}
                    >
                      <input
                        type="radio"
                        name="preferred"
                        value={value}
                        checked={values.preferred === value}
                        onChange={() => set('preferred', value)}
                        className="sr-only-focusable absolute"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          ) : null}
        </div>
      </fieldset>

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
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[var(--color-teal-deep)]"
          />
          <span>
            {labels.consent}{' '}
            <Link href={privacyHref} className="link-rule text-[0.875rem]">
              {labels.consentLink}
            </Link>
          </span>
        </label>
        {fieldError('consent')}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={status.kind === 'submitting'}
          className="btn btn-stone rounded-sm disabled:cursor-progress disabled:opacity-70"
        >
          {status.kind === 'submitting' ? (
            <>
              {/* A form that has gone quiet is indistinguishable from one that
                  has failed. The spinner is decoration for the eye only — the
                  label already carries the state for a screen reader. */}
              <span className="spinner" aria-hidden="true" />
              {labels.submitting}
            </>
          ) : (
            labels.submit
          )}
        </button>
        <a href={phone.href} className="link-rule text-[0.875rem]">
          {phone.display}
        </a>
      </div>
    </form>
  );
}
