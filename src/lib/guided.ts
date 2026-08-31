import type { GuidedServiceKey, LocationKey, TimelineKey } from '@/content/guided';
import { fileLimits, isValidEmail, isValidPhone } from './contact';

/**
 * The guided form's state machine.
 *
 * Kept out of the component so the flow can be reasoned about - and tested -  * without a DOM: every transition the visitor can cause is one action, and
 * the only way to reach the confirmation screen is a successful submission.
 *
 * `step` is the whole router: 0 is the intro, 1–6 are the questions, 7 is the
 * confirmation. The progress bar reads it, the back button reads it, and the
 * screen-reader announcement reads it, so there is exactly one place where
 * "which screen am I on" is decided.
 */

export const GUIDED_TOTAL_STEPS = 6;

export const STEP = {
  intro: 0,
  service: 1,
  problem: 2,
  location: 3,
  timeline: 4,
  photos: 5,
  contact: 6,
  confirmation: 7,
} as const;

export type StepIndex = (typeof STEP)[keyof typeof STEP];

/** The analytics name for each step - stable, never localised. */
export const STEP_NAMES: Record<number, string> = {
  1: 'service',
  2: 'problem',
  3: 'location',
  4: 'timeline',
  5: 'photos',
  6: 'contact',
};

export type GuidedFieldError = 'name' | 'phone' | 'email';
export type GuidedFileError = 'type' | 'size' | 'count';
export type GuidedSubmitError = 'failure' | 'rate_limited' | 'offline';

export type GuidedState = {
  step: number;
  service: GuidedServiceKey | null;
  problem: string | null;
  location: LocationKey | null;
  /** Only when `location` is `other`. */
  locationCustom: string;
  locationCustomError: boolean;
  timeline: TimelineKey | null;
  photos: File[];
  fileError: GuidedFileError | null;
  name: string;
  phone: string;
  email: string;
  fieldErrors: GuidedFieldError[];
  showErrors: boolean;
  isSubmitting: boolean;
  submitError: GuidedSubmitError | null;
  submitted: boolean;
  /** Kept after the state is cleared, for the confirmation greeting. */
  firstName: string;
  /** Epoch ms, stamped on the first interaction - never during render. */
  startedAt: number | null;
  /** The furthest step reached, for the abandonment event. */
  furthestStep: number;
};

export function initialGuidedState(defaultService?: GuidedServiceKey | null): GuidedState {
  return {
    step: STEP.intro,
    service: defaultService ?? null,
    problem: null,
    location: null,
    locationCustom: '',
    locationCustomError: false,
    timeline: null,
    photos: [],
    fileError: null,
    name: '',
    phone: '',
    email: '',
    fieldErrors: [],
    showErrors: false,
    isSubmitting: false,
    submitError: null,
    submitted: false,
    firstName: '',
    startedAt: null,
    furthestStep: STEP.intro,
  };
}

export type GuidedAction =
  | { type: 'START'; at: number }
  | { type: 'SELECT_SERVICE'; key: GuidedServiceKey }
  | { type: 'SELECT_PROBLEM'; key: string }
  | { type: 'SELECT_LOCATION'; key: LocationKey }
  | { type: 'SET_LOCATION_CUSTOM'; value: string }
  | { type: 'CONFIRM_LOCATION_CUSTOM' }
  | { type: 'SELECT_TIMELINE'; key: TimelineKey }
  | { type: 'ADD_PHOTOS'; files: File[]; maxFiles: number; maxBytes: number }
  | { type: 'REMOVE_PHOTO'; index: number }
  | { type: 'SET_FIELD'; field: GuidedFieldError; value: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; step: number }
  | { type: 'VALIDATE_CONTACT' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; error: GuidedSubmitError }
  | { type: 'RESET'; defaultService?: GuidedServiceKey | null };

/** The step a given screen advances to. Selections never skip a screen. */
function advance(state: GuidedState, patch: Partial<GuidedState>): GuidedState {
  const step = Math.min(state.step + 1, STEP.contact);
  return {
    ...state,
    ...patch,
    step,
    furthestStep: Math.max(state.furthestStep, step),
  };
}

export function guidedReducer(state: GuidedState, action: GuidedAction): GuidedState {
  switch (action.type) {
    case 'START':
      return {
        ...state,
        step: STEP.service,
        furthestStep: Math.max(state.furthestStep, STEP.service),
        startedAt: state.startedAt ?? action.at,
      };

    case 'SELECT_SERVICE':
      // Changing the service invalidates the problem chosen under the old
      // one - silently keeping it would send a "muret penche" lead tagged as
      // drainage, which is worse than asking the question again.
      return advance(state, {
        service: action.key,
        problem: state.service === action.key ? state.problem : null,
      });

    case 'SELECT_PROBLEM':
      return advance(state, { problem: action.key });

    case 'SELECT_LOCATION':
      // "Autre secteur" is the one card that does not advance: it opens the
      // single free-text field in the whole flow.
      if (action.key === 'other') {
        return { ...state, location: 'other', locationCustomError: false };
      }
      return advance(state, {
        location: action.key,
        locationCustom: '',
        locationCustomError: false,
      });

    case 'SET_LOCATION_CUSTOM':
      return { ...state, locationCustom: action.value, locationCustomError: false };

    case 'CONFIRM_LOCATION_CUSTOM':
      if (state.locationCustom.trim().length < 2) {
        return { ...state, locationCustomError: true };
      }
      return advance(state, { locationCustomError: false });

    case 'SELECT_TIMELINE':
      return advance(state, { timeline: action.key });

    case 'ADD_PHOTOS': {
      const accepted: File[] = [];
      let error: GuidedFileError | null = null;

      for (const file of action.files) {
        if (!file.type.startsWith('image/')) {
          error = 'type';
          continue;
        }
        if (file.size > action.maxBytes) {
          error = 'size';
          continue;
        }
        if (state.photos.length + accepted.length >= action.maxFiles) {
          error = 'count';
          continue;
        }
        // Same name and same size twice in a row is the visitor picking the
        // same photograph again, not a second angle on the problem.
        const duplicate = [...state.photos, ...accepted].some(
          (existing) => existing.name === file.name && existing.size === file.size,
        );
        if (!duplicate) accepted.push(file);
      }

      return { ...state, photos: [...state.photos, ...accepted], fileError: error };
    }

    case 'REMOVE_PHOTO':
      return {
        ...state,
        photos: state.photos.filter((_, index) => index !== action.index),
        fileError: null,
      };

    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.field === 'phone' ? formatPhone(action.value) : action.value,
        // An error the visitor is actively fixing should stop shouting at them.
        fieldErrors: state.fieldErrors.filter((key) => key !== action.field),
      };

    case 'NEXT_STEP':
      return advance(state, {});

    case 'PREV_STEP': {
      // Backing out of the city field returns to the city cards, not to the
      // timeline: the visitor's last action was opening that field.
      if (state.step === STEP.location && state.location === 'other') {
        return { ...state, location: null, locationCustomError: false };
      }
      return { ...state, step: Math.max(state.step - 1, STEP.service) };
    }

    case 'GO_TO_STEP':
      return { ...state, step: action.step };

    case 'VALIDATE_CONTACT':
      return { ...state, fieldErrors: validateGuidedContact(state), showErrors: true };

    case 'SUBMIT_START':
      return { ...state, isSubmitting: true, submitError: null };

    case 'SUBMIT_SUCCESS':
      return {
        ...initialGuidedState(),
        step: STEP.confirmation,
        submitted: true,
        firstName: firstNameOf(state.name),
        furthestStep: STEP.confirmation,
      };

    case 'SUBMIT_ERROR':
      return { ...state, isSubmitting: false, submitError: action.error };

    case 'RESET':
      return initialGuidedState(action.defaultService);

    default:
      return state;
  }
}

/* ------------------------------------------------------------- validation */

export function validateGuidedContact(state: GuidedState): GuidedFieldError[] {
  const errors: GuidedFieldError[] = [];
  if (state.name.trim().length < 2) errors.push('name');
  if (!isValidPhone(state.phone)) errors.push('phone');
  if (state.email.trim() && !isValidEmail(state.email)) errors.push('email');
  return errors;
}

/* ---------------------------------------------------------------- helpers */

/**
 * Formats as the visitor types, without ever fighting them: digits beyond
 * the tenth are dropped rather than appended, and a partially typed number
 * is shown partially formatted so backspace behaves the way it looks.
 */
export function formatPhone(value: string): string {
  const digits = value
    .replace(/\D/g, '')
    .replace(/^1(?=\d{10})/, '')
    .slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '').replace(/^1(?=\d{10})/, '');
}

/** The greeting on the confirmation screen. Never a surname, never empty. */
export function firstNameOf(name: string): string {
  const first = name.trim().split(/\s+/)[0] ?? '';
  return first.length > 0 ? first : name.trim();
}

/** Whether the visitor can leave the step they are on. */
export function canAdvance(state: GuidedState): boolean {
  switch (state.step) {
    case STEP.service:
      return state.service !== null;
    case STEP.problem:
      return state.problem !== null;
    case STEP.location:
      return state.location !== null && (state.location !== 'other' || !!state.locationCustom);
    case STEP.timeline:
      return state.timeline !== null;
    default:
      return true;
  }
}

/** Photo limits for the guided form, read from the shared contact rules. */
export const guidedFileLimits = fileLimits('guided');
