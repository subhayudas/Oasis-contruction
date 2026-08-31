'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { guidedCopy, type GuidedServiceKey } from '@/content/guided';
import type { Locale } from '@/lib/i18n';
import { GuidedForm } from './GuidedForm';

type OpenOptions = {
  /** The CTA that opened it — recorded on the `form_view` event. */
  source: string;
  service?: GuidedServiceKey;
};

type GuidedFormContext = {
  open: (options: OpenOptions) => void;
  close: () => void;
  isOpen: boolean;
};

const Context = createContext<GuidedFormContext | null>(null);

/**
 * Lets any button on the site open the guided form.
 *
 * The form is mounted once, at the layout, and every CTA asks this context to
 * show it. That is what makes "Demandez un devis" and "Envoyez-nous une
 * photo" the same experience rather than two funnels with two lead schemas
 * and two sets of bugs — the photo step is inside the flow, not beside it.
 *
 * Nothing renders until a CTA is pressed, so the form costs a closed page
 * nothing but this provider.
 */
export function GuidedFormProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [options, setOptions] = useState<OpenOptions | null>(null);

  const open = useCallback((next: OpenOptions) => setOptions(next), []);
  const close = useCallback(() => setOptions(null), []);

  return (
    <Context.Provider value={{ open, close, isOpen: options !== null }}>
      {children}
      {options ? (
        <GuidedFormModal
          locale={locale}
          source={options.source}
          service={options.service}
          onClose={close}
        />
      ) : null}
    </Context.Provider>
  );
}

export function useGuidedForm(): GuidedFormContext | null {
  return useContext(Context);
}

/* ------------------------------------------------------------------ modal */

/**
 * Everything the platform would put in the tab order, and nothing else.
 *
 * The `tabindex="-1"` exclusion is load-bearing rather than tidy: the form's
 * honeypot is a real `<input>` that a bot can see and a person must never
 * reach, so a trap that counted it would send Shift+Tab from the first
 * control onto an invisible field.
 */
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]',
]
  .map((selector) => `${selector}:not([tabindex="-1"])`)
  .join(',');

/**
 * A dialog that behaves like one: focus moves in, stays in while it is open,
 * and goes back to the button that opened it on close. Escape closes it, and
 * the page behind it cannot scroll — on a phone, a modal over a scrolling
 * page is how a half-filled form gets lost.
 */
function GuidedFormModal({
  locale,
  source,
  service,
  onClose,
}: {
  locale: Locale;
  source: string;
  service?: GuidedServiceKey;
  onClose: () => void;
}) {
  const copy = guidedCopy(locale);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    restoreTo.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Focus the panel rather than its first control: dropping a visitor
    // straight onto a card would read the option before the question.
    panelRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = overflow;
      restoreTo.current?.focus?.({ preventScroll: true });
    };
  }, []);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;

    const panel = panelRef.current;
    if (!panel) return;
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) =>
        !element.closest('[aria-hidden="true"]') &&
        (element.offsetParent !== null || element === document.activeElement),
    );
    if (focusable.length === 0) return;

    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="g-modal" onKeyDown={onKeyDown}>
      <div className="g-modal-veil" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={copy.formLabel}
        tabIndex={-1}
        className="g-modal-panel"
      >
        <GuidedForm
          locale={locale}
          source={source}
          defaultService={service}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
