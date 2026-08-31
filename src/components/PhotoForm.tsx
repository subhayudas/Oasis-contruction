'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import { fill } from '@/content/placeholders';
import type { Dictionary } from '@/content/dictionary';
import { trackFormStart, trackFormSubmit, trackPhotoUpload } from '@/lib/analytics';
import {
  validateContact,
  validateFiles,
  type ContactErrorKey,
  type ContactPayload,
  type ContactResponse,
} from '@/lib/contact';
import { recaptchaToken } from '@/lib/recaptcha';
import { IconAlert, IconCheck } from './icons';
import { PhotoDropzone } from './PhotoDropzone';

type Props = {
  locale: string;
  privacyHref: string;
  phone: { href: string; display: string };
  email: { href: string; display: string };
  t: Dictionary;
  /** Rendered under the confirmation, once the photo is in. */
  confirmationExtra?: React.ReactNode;
  className?: string;
};

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
 * The photo funnel's form.
 *
 * The order is deliberate and matches the funnel: the photograph first, while
 * the visitor still has the phone in their hand and the problem in front of
 * them, then the two fields we need to call them back, then anything they feel
 * like adding. Asking for a name before a photo turns a thirty-second action
 * into a form.
 */
export function PhotoForm({
  locale,
  privacyHref,
  phone,
  email,
  t,
  confirmationExtra,
  className = '',
}: Props) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  /* The floor on how fast a human can fill this in. Stamped on mount rather
     than during render — reading the clock while rendering is impure, and a
     re-render would move the start of the window. */
  const mountedAt = useRef<number | null>(null);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  const started = useRef(false);

  const [values, setValues] = useState<ContactPayload>({ ...EMPTY, locale });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<ContactErrorKey[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'rate_limited' | 'failure'
  >('idle');

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;
  const has = (key: ContactErrorKey) => showErrors && errors.includes(key);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackFormStart('photo');
  }

  function set<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) {
    markStarted();
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const found = [...validateContact(values, 'photo'), ...validateFiles(files, 'photo')];
    setErrors(found);
    setShowErrors(true);

    if (found.length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus('submitting');

    const body = new FormData();
    body.set('name', values.name);
    body.set('email', values.email);
    body.set('phone', values.phone);
    body.set('message', values.message);
    body.set('duration', values.duration);
    body.set('preferred', 'phone');
    body.set('consent', String(values.consent));
    body.set('locale', values.locale);
    body.set('variant', 'photo');
    body.set('website', values.website);
    body.set('elapsed', String(mountedAt.current ? Date.now() - mountedAt.current : 0));
    body.set('recaptcha', await recaptchaToken('photo_form'));
    files.forEach((file) => body.append('photos', file));

    try {
      const response = await fetch('/api/contact', { method: 'POST', body });
      const data = (await response.json()) as ContactResponse;

      if (data.ok) {
        trackPhotoUpload(files.length);
        trackFormSubmit('photo');
        setStatus('success');
        setValues({ ...EMPTY, locale });
        setFiles([]);
        setShowErrors(false);
        formRef.current?.reset();
      } else if (data.code === 'validation' && data.errors) {
        setErrors(data.errors);
        setStatus('idle');
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      } else if (data.code === 'rate_limited') {
        setStatus('rate_limited');
      } else {
        setStatus('failure');
      }
    } catch {
      setStatus('failure');
    }

    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status === 'success') {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className={`panel-in s-plaque !border-l-green-deep border-l-2 px-6 py-7 ${className}`}
      >
        <p className="relative z-10 flex items-center gap-2.5">
          <IconCheck className="check-draw text-green-deep h-6 w-6 shrink-0" />
          <span className="u-h3">{t.photoPage.confirmTitle}</span>
        </p>
        <p className="u-body relative z-10 mt-3">{fill(t.photoPage.confirmBody)}</p>
        <p className="relative z-10 mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
          <a href={phone.href} className="link-rule">
            {phone.display}
          </a>
          <a href={email.href} className="link-rule break-all">
            {email.display}
          </a>
        </p>
        {confirmationExtra ? (
          <div className="relative z-10 mt-8">{confirmationExtra}</div>
        ) : null}
      </div>
    );
  }

  const labelCls = 'u-label mb-2 block text-[0.625rem] tracking-[0.16em] text-ink-70';
  const fieldError = (key: ContactErrorKey) =>
    has(key) ? (
      <p id={errorId(key)} className="mt-1.5 text-[0.8125rem] text-[var(--color-danger-deep)]">
        {t.form.errors[key]}
      </p>
    ) : null;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className={`flex flex-col gap-6 ${className}`}
    >
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
              <li key={key}>{t.form.errors[key]}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {status === 'rate_limited' || status === 'failure' ? (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="panel-in s-plaque border-l-2 !border-l-[var(--color-danger-deep)] px-5 py-4"
        >
          <p className="relative z-10 text-[0.9375rem] font-[550]">
            {status === 'rate_limited' ? t.form.rateLimitTitle : t.form.failureTitle}
          </p>
          <p className="u-body relative z-10 mt-2 text-[0.875rem]">
            {status === 'rate_limited' ? t.form.rateLimitBody : t.form.failureBody}
          </p>
        </div>
      ) : null}

      <div>
        <label htmlFor={fieldId('photos')} className={labelCls}>
          {t.form.photosRequired} <span className="text-ink-50">({t.form.required})</span>
        </label>
        <PhotoDropzone
          id={fieldId('photos')}
          files={files}
          onChange={(next) => {
            markStarted();
            setFiles(next);
          }}
          describedBy={`${fieldId('photos')}-help`}
          invalid={
            has('fileRequired') || has('fileCount') || has('fileSize') || has('fileType')
          }
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
        {fieldError('fileRequired')}
        {fieldError('fileCount')}
        {fieldError('fileSize')}
        {fieldError('fileType')}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId('name')} className={labelCls}>
            {t.form.name} <span className="text-ink-50">({t.form.required})</span>
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
            {t.form.phone} <span className="text-ink-50">({t.form.required})</span>
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

        <div className="sm:col-span-2">
          <label htmlFor={fieldId('email')} className={labelCls}>
            {t.form.email} <span className="text-ink-50">({t.form.optional})</span>
          </label>
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t.form.emailPlaceholder}
            value={values.email}
            onChange={(event) => set('email', event.target.value)}
            aria-invalid={has('email')}
            aria-describedby={has('email') ? errorId('email') : undefined}
            className="field"
          />
          {fieldError('email')}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fieldId('message')} className={labelCls}>
            {t.form.description} <span className="text-ink-50">({t.form.optional})</span>
          </label>
          <textarea
            id={fieldId('message')}
            name="message"
            rows={3}
            placeholder={t.form.descriptionPlaceholder}
            value={values.message}
            onChange={(event) => set('message', event.target.value)}
            className="field resize-y"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={fieldId('duration')} className={labelCls}>
            {t.form.duration} <span className="text-ink-50">({t.form.optional})</span>
          </label>
          <input
            id={fieldId('duration')}
            name="duration"
            type="text"
            placeholder={t.form.durationPlaceholder}
            value={values.duration}
            onChange={(event) => set('duration', event.target.value)}
            className="field"
          />
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

      <p className="u-meta">{t.form.privacyNotePhoto}</p>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={status === 'submitting'}
          data-cta={t.form.submitPhoto}
          data-cta-location="photo-form"
          className="btn btn-stone w-full disabled:cursor-progress sm:w-auto"
        >
          {status === 'submitting' ? (
            <>
              <span className="spinner" aria-hidden="true" />
              {t.form.submitting}
            </>
          ) : (
            t.form.submitPhoto
          )}
        </button>
        <a href={phone.href} className="link-rule min-h-11 text-[0.875rem]">
          {phone.display}
        </a>
      </div>
    </form>
  );
}
