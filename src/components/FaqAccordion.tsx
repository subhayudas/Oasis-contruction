'use client';

import { useId, useState } from 'react';

import { trackFaq } from '@/lib/analytics';
import { IconPlus } from './icons';

export type FaqEntry = { q: string; a: string };

/**
 * Native <details>/<summary> would be simpler, but it cannot animate its own
 * height and it cannot report which question was opened. This does both, keeps
 * the whole row a 44px+ tap target, and stays a real button for a keyboard.
 *
 * Answers stay in the DOM at all times so they are findable with Ctrl-F and
 * indexable — only the height and visibility are toggled.
 */
export function FaqAccordion({ items }: { items: FaqEntry[] }) {
  const uid = useId();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ul className="border-t border-[var(--line)]">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${uid}-panel-${index}`;
        const buttonId = `${uid}-button-${index}`;

        return (
          <li key={item.q} className="border-b border-[var(--line)]">
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpen(isOpen ? null : index);
                  if (!isOpen) trackFaq(item.q);
                }}
                className="hover:text-brass-deep flex w-full items-start justify-between gap-5 py-5 text-left text-[1.0625rem] font-[560] tracking-[-0.01em] transition-colors"
              >
                <span>{item.q}</span>
                <IconPlus
                  className={`text-brass-deep mt-0.5 h-5 w-5 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'is-open rotate-180' : ''
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="accordion-panel"
            >
              <p className="u-body max-w-[62ch] pb-6 text-[0.9375rem]">{item.a}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
