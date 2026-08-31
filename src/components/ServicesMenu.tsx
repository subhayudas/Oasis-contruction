'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

import { IconChevron } from './icons';

export type ServiceLink = { href: string; label: string; description: string };

type Props = {
  label: string;
  /** The services hub, so the trigger is still a destination. */
  href: string;
  openLabel: string;
  items: ServiceLink[];
};

/**
 * The services dropdown.
 *
 * Hover alone is not enough: on a touch screen there is no hover, and a
 * menu that only opens on hover is a menu a phone user cannot reach. So the
 * trigger is a real button that toggles on click and on Enter, and hover is
 * layered on top for a mouse. The hub link sits inside the panel rather than
 * on the trigger, so the trigger has exactly one job.
 */
export function ServicesMenu({ label, href, openLabel, items }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  /* Close whenever navigation actually happens. React documents this
     render-phase comparison as the way to adjust state from a changed prop —
     an effect that calls setState would render the open menu once first. */
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  // A mouse leaving the trigger on its way to the panel must not close it.
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType !== 'mouse') return;
        cancelClose();
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') return;
        scheduleClose();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        aria-label={open ? undefined : openLabel}
        onClick={() => setOpen((value) => !value)}
        className="link-quiet hover:text-brass-deep inline-flex min-h-11 items-center gap-1.5 rounded-[1px] px-3.5 text-[0.875rem] font-[550] tracking-[-0.005em] transition-colors hover:bg-[rgba(255,255,255,0.75)]"
      >
        {label}
        <IconChevron
          className={`h-3 w-3 transition-transform duration-200 ${open ? '-rotate-90' : 'rotate-90'}`}
        />
      </button>

      <div
        id={panelId}
        data-open={open ? 'true' : 'false'}
        className="menu-panel glass-panel absolute top-[calc(100%+0.75rem)] left-1/2 z-50 w-[26rem] -translate-x-1/2 p-2"
      >
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="hover:bg-sand/80 flex flex-col gap-0.5 rounded-lg px-3.5 py-2.5 transition-colors"
              >
                <span className="text-ink text-[0.9375rem] font-[560]">{item.label}</span>
                <span className="text-ink-50 text-[0.8125rem] leading-snug">
                  {item.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={href}
          className="link-rule mx-3.5 mt-1 mb-1 inline-flex min-h-10 text-[0.8125rem]"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
