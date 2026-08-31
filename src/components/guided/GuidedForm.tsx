'use client';

import { useEffect, useReducer, useRef, useState } from 'react';

import {
  guidedCopy,
  locationChoice,
  problemChoice,
  serviceChoice,
  timelineChoice,
  type GuidedServiceKey,
  type LocationKey,
  type TimelineKey,
} from '@/content/guided';
import { site } from '@/content/site';
import {
  currentPageUrl,
  trackFormStart,
  trackFormSubmit,
  trackGuidedAbandon,
  trackGuidedBack,
  trackGuidedContactStarted,
  trackGuidedError,
  trackGuidedLead,
  trackGuidedPhotoSkip,
  trackGuidedPhotos,
  trackGuidedStep,
  trackGuidedView,
} from '@/lib/analytics';
import type { ContactResponse } from '@/lib/contact';
import {
  GUIDED_TOTAL_STEPS,
  STEP,
  STEP_NAMES,
  guidedFileLimits,
  guidedReducer,
  initialGuidedState,
  normalizePhone,
  validateGuidedContact,
  type GuidedFieldError,
} from '@/lib/guided';
import type { Locale } from '@/lib/i18n';
import { recaptchaToken } from '@/lib/recaptcha';
import { pagePath } from '@/lib/routes';
import { IconBack, IconClose } from '@/components/icons';
import { FormConfirmation } from './FormConfirmation';
import { FormIntro } from './FormIntro';
import { FormProgress } from './FormProgress';
import { StepContact } from './StepContact';
import { StepLocation } from './StepLocation';
import { StepPhotos } from './StepPhotos';
import { StepProblem } from './StepProblem';
import { StepService } from './StepService';
import { StepTimeline } from './StepTimeline';

/** How long a tapped card stays lit before the next question replaces it. */
const CONFIRM_MS = 300;

type Props = {
  locale: Locale;
  /** Where the form was opened from — recorded on every lead. */
  source: string;
  /** Pre-highlights the matching card on a service or campaign page. */
  defaultService?: GuidedServiceKey;
  /** Present when the form is in a modal; absent when embedded in a page. */
  onClose?: () => void;
  className?: string;
};

/**
 * The guided lead form.
 *
 * Six questions, one per screen, answered by tapping. Only the name and the
 * phone number are typed — everything the crew needs to prepare for the call
 * arrives as structured selections the visitor never had to phrase.
 *
 * Three things are worth knowing about how it behaves:
 *
 *   The 300ms pause after a tap is not a delay, it is the receipt. Advancing
 *   on the same frame as the press makes a correct selection feel like a
 *   mis-tap, because the card the thumb was on is gone before the eye lands.
 *
 *   State lives in a reducer in `lib/guided.ts`, so the flow can be reasoned
 *   about without a DOM and the only route to the confirmation screen is a
 *   submission the server accepted.
 *
 *   Nothing is submitted until the last screen, so a visitor who leaves at
 *   step 4 leaves no half-lead behind — only a `form_abandon` event saying
 *   which screen lost them.
 */
export function GuidedForm({ locale, source, defaultService, onClose, className = '' }: Props) {
  const copy = guidedCopy(locale);
  const [state, dispatch] = useReducer(
    guidedReducer,
    defaultService ?? null,
    initialGuidedState,
  );
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [pending, setPending] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedAt = useRef<number | null>(null);
  const honeypot = useRef('');
  const liveRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const submitted = useRef(false);
  /* Mirrors the reducer's own high-water mark so the unmount cleanup below
     can read it without re-subscribing on every step. */
  const furthest = useRef(0);
  useEffect(() => {
    furthest.current = state.furthestStep;
  }, [state.furthestStep]);

  /* Stamped in an effect rather than during render: reading the clock while
     rendering is impure, and a re-render would move the start of the window
     the server uses to tell a human from a script. */
  const viewed = useRef(false);
  useEffect(() => {
    mountedAt.current = Date.now();
    // Guarded because a mount effect is the classic way to send one
    // analytics event twice — React's development double-invoke, and any
    // future remount, would otherwise double-count every form open.
    if (viewed.current) return;
    viewed.current = true;
    trackGuidedView(currentPageUrl(), source);
  }, [source]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  /* A visitor who closes or navigates away mid-flow is the most valuable
     signal this form produces: it says which screen is leaking. Recorded
     once, and never for someone who actually submitted. */
  useEffect(() => {
    return () => {
      if (submitted.current || furthest.current < STEP.service) return;
      const seconds = mountedAt.current
        ? Math.round((Date.now() - mountedAt.current) / 1000)
        : 0;
      trackGuidedAbandon(furthest.current, seconds);
    };
  }, []);

  /* Each new question starts at the top of its own screen.
     In the modal that means resetting the sheet's own scroll; embedded in a
     page there is no inner scroller, so the form itself is brought back
     into view — and only when it has actually left, so a visitor already
     looking at it is never yanked. */
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    if (scroller.scrollHeight > scroller.clientHeight + 1) {
      scroller.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    const { top } = scroller.getBoundingClientRect();
    if (top < 0) scroller.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [state.step]);

  const isConfirmation = state.step === STEP.confirmation;
  const isIntro = state.step === STEP.intro;

  /** A tap on a single-select card: light it, then move. */
  function choose(stepNumber: number, value: string, action: () => void) {
    if (pending) return;
    setDirection('forward');
    setPending(true);
    trackGuidedStep(stepNumber, STEP_NAMES[stepNumber] ?? String(stepNumber), value);
    timer.current = setTimeout(() => {
      action();
      setPending(false);
    }, CONFIRM_MS);
  }

  function handleStart() {
    setDirection('forward');
    trackFormStart('guided');
    dispatch({ type: 'START', at: Date.now() });
  }

  function handleBack() {
    if (pending) return;
    setDirection('back');
    trackGuidedBack(state.step, Math.max(state.step - 1, STEP.service));
    dispatch({ type: 'PREV_STEP' });
  }

  function handleAddPhotos(files: File[]) {
    dispatch({
      type: 'ADD_PHOTOS',
      files,
      maxFiles: guidedFileLimits.maxFiles,
      maxBytes: guidedFileLimits.maxBytes,
    });
  }

  /* The file error lives in the reducer, so reporting it belongs here rather
     than in the branch that computed it — this fires once per new error. */
  useEffect(() => {
    if (state.fileError) trackGuidedError(STEP.photos, 'photos', state.fileError);
  }, [state.fileError]);

  function handlePhotoContinue() {
    setDirection('forward');
    trackGuidedPhotos(state.photos.length);
    trackGuidedStep(STEP.photos, 'photos', String(state.photos.length));
    dispatch({ type: 'NEXT_STEP' });
  }

  function handlePhotoSkip() {
    setDirection('forward');
    trackGuidedPhotoSkip();
    trackGuidedStep(STEP.photos, 'photos', '0');
    dispatch({ type: 'NEXT_STEP' });
  }

  async function handleSubmit() {
    if (state.isSubmitting) return;

    const found = validateGuidedContact(state);
    if (found.length > 0) {
      dispatch({ type: 'VALIDATE_CONTACT' });
      found.forEach((field) => trackGuidedError(STEP.contact, field, 'invalid'));
      return;
    }

    dispatch({ type: 'SUBMIT_START' });

    const service = state.service ? serviceChoice(locale, state.service) : undefined;
    const problem =
      state.service && state.problem
        ? problemChoice(locale, state.service, state.problem)
        : undefined;
    const location = state.location ? locationChoice(locale, state.location) : undefined;
    const timeline = state.timeline ? timelineChoice(locale, state.timeline) : undefined;
    const city =
      state.location === 'other' ? state.locationCustom.trim() : (location?.label ?? '');

    const body = new FormData();
    body.set('variant', 'guided');
    body.set('name', state.name.trim());
    body.set('phone', state.phone.trim());
    body.set('phoneNormalized', normalizePhone(state.phone));
    body.set('email', state.email.trim());
    body.set('service', state.service ?? '');
    body.set('serviceLabel', service?.label ?? '');
    body.set('problem', state.problem ?? '');
    body.set('problemLabel', problem?.label ?? '');
    body.set('city', city);
    body.set('locationKey', state.location ?? '');
    body.set('timeline', state.timeline ?? '');
    body.set('timelineLabel', timeline?.label ?? '');
    body.set('preferred', 'phone');
    // The notice above the submit key states what the consent is for, and
    // pressing the key is the act of giving it.
    body.set('consent', 'true');
    body.set('locale', locale);
    body.set('source', currentPageUrl() || source);
    body.set('website', honeypot.current);
    body.set('elapsed', String(mountedAt.current ? Date.now() - mountedAt.current : 0));
    body.set('recaptcha', await recaptchaToken('guided_form'));
    state.photos.forEach((file) => body.append('photos', file));

    try {
      const response = await fetch('/api/contact', { method: 'POST', body });
      const data = (await response.json()) as ContactResponse;

      if (data.ok) {
        submitted.current = true;
        const seconds = mountedAt.current
          ? Math.round((Date.now() - mountedAt.current) / 1000)
          : 0;
        trackFormSubmit('guided');
        trackGuidedLead({
          service: state.service ?? 'unknown',
          problem: state.problem ?? 'unknown',
          location: state.location ?? 'unknown',
          timeline: state.timeline ?? 'unknown',
          photoCount: state.photos.length,
          seconds,
        });
        dispatch({ type: 'SUBMIT_SUCCESS' });
        return;
      }

      const error = data.code === 'rate_limited' ? 'rate_limited' : 'failure';
      trackGuidedError(STEP.contact, 'submit', data.code);
      dispatch({ type: 'SUBMIT_ERROR', error });
    } catch {
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
      trackGuidedError(STEP.contact, 'submit', offline ? 'offline' : 'network');
      dispatch({ type: 'SUBMIT_ERROR', error: offline ? 'offline' : 'failure' });
    }
  }

  /* What the visitor told us, read back on the last screen. */
  const summary = [
    state.service ? serviceChoice(locale, state.service)?.label : null,
    state.service && state.problem
      ? problemChoice(locale, state.service, state.problem)?.label
      : null,
    state.location === 'other'
      ? state.locationCustom.trim()
      : state.location
        ? locationChoice(locale, state.location)?.label
        : null,
    state.timeline ? timelineChoice(locale, state.timeline)?.label : null,
  ].filter((entry): entry is string => Boolean(entry));

  const showBack = state.step > STEP.service && state.step <= STEP.contact;

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className}`}>
      {/* Bot trap: never rendered to a reader, never reachable by tab. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="guided-website">Website</label>
        <input
          id="guided-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          onChange={(event) => {
            honeypot.current = event.target.value;
          }}
        />
      </div>

      {!isIntro && !isConfirmation ? (
        <div className="flex items-center gap-4 px-6 pt-5 pb-4 sm:px-8">
          <FormProgress
            current={state.step}
            total={GUIDED_TOTAL_STEPS}
            label={copy.progressLabel}
          />
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label={copy.close}
              className="text-ink-50 hover:text-ink -m-2 flex h-11 w-11 shrink-0 items-center justify-center"
            >
              <IconClose className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      ) : onClose ? (
        <div className="flex justify-end px-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            aria-label={copy.close}
            className="text-ink-50 hover:text-ink flex h-11 w-11 items-center justify-center"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
      ) : null}

      {/* The one place a screen reader is told where it is. Polite, because
          the visitor's own tap caused the change and does not need
          interrupting. */}
      <div ref={liveRef} aria-live="polite" className="sr-only">
        {!isIntro && !isConfirmation
          ? `${copy.stepAnnouncement(state.step, GUIDED_TOTAL_STEPS)}`
          : ''}
      </div>

      {/* The intro is short and the sheet is tall, so it is centred rather
          than left stranded at the top of a screen of white. Every other
          step fills the space and starts at the top. */}
      <div
        ref={scrollRef}
        className={`min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-2 pb-8 sm:px-8 ${
          isIntro ? 'flex flex-col justify-center' : ''
        }`}
      >
        <div key={state.step} className="g-step" data-direction={direction}>
          {isIntro ? <FormIntro copy={copy} onStart={handleStart} /> : null}

          {state.step === STEP.service ? (
            <StepService
              copy={copy}
              selected={state.service}
              pending={pending}
              onSelect={(key) =>
                choose(STEP.service, key, () => dispatch({ type: 'SELECT_SERVICE', key }))
              }
            />
          ) : null}

          {state.step === STEP.problem && state.service ? (
            <StepProblem
              copy={copy}
              service={state.service}
              selected={state.problem}
              pending={pending}
              onSelect={(key) =>
                choose(STEP.problem, key, () => dispatch({ type: 'SELECT_PROBLEM', key }))
              }
            />
          ) : null}

          {state.step === STEP.location ? (
            <StepLocation
              copy={copy}
              selected={state.location}
              custom={state.locationCustom}
              customError={state.locationCustomError}
              pending={pending}
              onSelect={(key: LocationKey) => {
                if (key === 'other') {
                  dispatch({ type: 'SELECT_LOCATION', key });
                  return;
                }
                choose(STEP.location, key, () => dispatch({ type: 'SELECT_LOCATION', key }));
              }}
              onCustomChange={(value) => dispatch({ type: 'SET_LOCATION_CUSTOM', value })}
              onCustomConfirm={() => {
                if (state.locationCustom.trim().length < 2) {
                  dispatch({ type: 'CONFIRM_LOCATION_CUSTOM' });
                  return;
                }
                setDirection('forward');
                trackGuidedStep(STEP.location, 'location', 'other');
                dispatch({ type: 'CONFIRM_LOCATION_CUSTOM' });
              }}
            />
          ) : null}

          {state.step === STEP.timeline ? (
            <StepTimeline
              copy={copy}
              selected={state.timeline}
              pending={pending}
              onSelect={(key: TimelineKey) =>
                choose(STEP.timeline, key, () => dispatch({ type: 'SELECT_TIMELINE', key }))
              }
            />
          ) : null}

          {state.step === STEP.photos ? (
            <StepPhotos
              copy={copy}
              photos={state.photos}
              error={state.fileError}
              onAdd={handleAddPhotos}
              onRemove={(index) => dispatch({ type: 'REMOVE_PHOTO', index })}
              onContinue={handlePhotoContinue}
              onSkip={handlePhotoSkip}
            />
          ) : null}

          {state.step === STEP.contact ? (
            <StepContact
              copy={copy}
              name={state.name}
              phone={state.phone}
              email={state.email}
              errors={state.fieldErrors}
              showErrors={state.showErrors}
              submitting={state.isSubmitting}
              submitError={state.submitError}
              privacyHref={pagePath(locale, 'privacy')}
              phoneLink={{ href: site.phone.href, display: site.phone.display }}
              summary={summary}
              onChange={(field: GuidedFieldError, value) =>
                dispatch({ type: 'SET_FIELD', field, value })
              }
              onFocusFirst={trackGuidedContactStarted}
              onSubmit={handleSubmit}
            />
          ) : null}

          {isConfirmation ? (
            <FormConfirmation
              copy={copy}
              locale={locale}
              firstName={state.firstName}
              onClose={onClose}
            />
          ) : null}
        </div>

        {showBack ? (
          <button
            type="button"
            onClick={handleBack}
            className="link-rule text-ink-50 mt-7 min-h-11 text-[0.875rem]"
          >
            <IconBack className="h-4 w-4" />
            {copy.back}
          </button>
        ) : null}
      </div>
    </div>
  );
}
