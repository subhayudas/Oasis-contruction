'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { IconArrow, IconChevron, IconClose, IconMenu, IconPhone } from './icons';

export type NavItem = { href: string; label: string; description?: string };

type Props = {
  items: NavItem[];
  services: NavItem[];
  servicesLabel: string;
  quote: { href: string; label: string };
  phone: { href: string; display: string; label: string };
  labels: { open: string; close: string; menu: string };
  localeSwitch: React.ReactNode;
};

/**
 * A full-height sheet: a focus trap, Escape to close, the scroll lock, and
 * every entry a real link, so the panel is usable with a keyboard, a screen
 * reader or a thumb.
 *
 * The sheet belongs to the right edge of the screen — it arrives from there
 * and returns there, which is what gives a phone a place to picture the menu
 * when it is shut. That needs an exit as well as an entrance, so the markup
 * stays in the document and `visibility` does the hiding: it takes the panel
 * out of the tab order and the accessibility tree exactly like unmounting
 * would, while still letting the transition play on the way out.
 */
export function MobileNav({
  items,
  services,
  servicesLabel,
  quote,
  phone,
  labels,
  localeSwitch,
}: Props) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const panelId = useId();
  const servicesId = `${panelId}-services`;
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const close = useCallback(() => {
    setOpen(false);
    setServicesOpen(false);
    triggerRef.current?.focus();
  }, []);

  /* Close whenever navigation actually happens. React documents this
     render-phase comparison as the way to adjust state from a changed prop —
     an effect that calls setState would render the open sheet once first. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('a, button')?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={labels.open}
        className="btn btn-quarry h-11 min-h-11 w-11 !px-0 lg:hidden"
      >
        <IconMenu className="h-5 w-5" />
      </button>

      <div
        className="drawer-root fixed inset-0 z-50 lg:hidden"
        data-open={open ? 'true' : 'false'}
      >
        <button
          type="button"
          aria-label={labels.close}
          tabIndex={-1}
          onClick={close}
          className="drawer-veil bg-ink/45 absolute inset-0 h-full w-full cursor-default"
        />
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label={labels.menu}
          className="drawer-panel glass-panel absolute inset-y-0 right-0 flex w-full max-w-[24rem] flex-col overflow-y-auto shadow-[-24px_0_60px_-30px_rgba(26,22,16,0.65)]"
        >
          <div className="grain-overlay flex items-center justify-between border-b border-[var(--line)] px-5 py-3.5">
            {localeSwitch}
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="btn btn-quarry h-11 min-h-11 w-11 !px-0"
            >
              <IconClose className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label={labels.menu} className="flex-1 px-5 py-6">
            <div className="mt-2 border-b border-[var(--line)]">
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-controls={servicesId}
                onClick={() => setServicesOpen((value) => !value)}
                className="flex min-h-[3.25rem] w-full items-center justify-between gap-3 py-2 text-left text-[1.375rem] font-[550] tracking-[-0.02em]"
              >
                {servicesLabel}
                <IconChevron
                  className={`text-ink-50 h-5 w-5 transition-transform duration-200 ${
                    servicesOpen ? '-rotate-90' : 'rotate-90'
                  }`}
                />
              </button>
              {/* `hidden` and a `display` utility have equal specificity, so
                  the utility wins and the attribute does nothing. The class
                  has to carry the state instead. */}
              <ul
                id={servicesId}
                className={servicesOpen ? 'flex flex-col gap-0.5 pb-3 pl-1' : 'hidden'}
              >
                {services.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-ink-70 hover:text-brass-deep flex min-h-[2.875rem] items-center text-[1rem] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="flex flex-col" data-mobile-nav-items>
              {items.map((item, index) => (
                <li
                  key={item.href}
                  className="drawer-item border-b border-[var(--line)]"
                  style={{ ['--i' as string]: index }}
                >
                  <Link
                    href={item.href}
                    className="flex min-h-[3.25rem] items-center justify-between gap-3 py-2 text-[1.375rem] font-[550] tracking-[-0.02em]"
                  >
                    {item.label}
                    <IconArrow className="text-ink-50 h-5 w-5" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="s-tray sticky bottom-0 grid grid-cols-2 gap-2.5 border-t border-[var(--line)] p-4">
            <a href={phone.href} className="btn btn-quarry" aria-label={phone.label}>
              <IconPhone className="h-4 w-4" />
              {phone.display}
            </a>
            <Link href={quote.href} className="btn btn-stone">
              {quote.label}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
