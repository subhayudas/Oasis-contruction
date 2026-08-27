'use client';

import { useId, useState } from 'react';

import { Picture } from './Picture';
import type { Source } from '@/lib/images';

type Props = {
  before: { sources: Source[]; alt: string };
  after: { sources: Source[]; alt: string };
  labels: {
    before: string;
    after: string;
    control: string;
    help: string;
    valueText: string;
  };
  sizes: string;
  className?: string;
};

/**
 * A before/after comparator built on a native range input: it drags with a
 * pointer, works with touch, steps with the arrow keys, jumps with Home/End,
 * and announces its position. The wipe follows the pointer with no transition,
 * so there is nothing to disable under prefers-reduced-motion, and both
 * photographs stay fully described in their alt text whatever the position.
 */
export function BeforeAfter({ before, after, labels, sizes, className = '' }: Props) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <figure className={className}>
      <div
        className="frame frame-keyline relative isolate select-none"
        style={{ ['--pos' as string]: `${position}%` }}
      >
        {/* Base layer: the finished result. */}
        <Picture sources={after.sources} alt={after.alt} sizes={sizes} className="block" />

        {/* Wipe layer: the state before the work, clipped to the handle. */}
        <div
          className="absolute inset-0"
          style={{ clipPath: 'inset(0 calc(100% - var(--pos)) 0 0)' }}
          aria-hidden="true"
        >
          <Picture
            sources={before.sources}
            alt=""
            sizes={sizes}
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
        </div>
        {/* The "before" photograph still needs a description for screen readers. */}
        <span className="sr-only">{before.alt}</span>

        <span
          aria-hidden="true"
          className="bg-paper/90 pointer-events-none absolute inset-y-0 z-10 w-px shadow-[0_0_0_1px_rgba(12,26,43,0.35)]"
          style={{ left: 'var(--pos)' }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(255,255,255,0.9)] bg-gradient-to-b from-white to-[#dbe8f9] shadow-[inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_0_rgba(31,111,235,0.22),0_2px_4px_rgba(12,26,43,0.35),0_10px_18px_-10px_rgba(12,26,43,0.7)]"
          style={{ left: 'var(--pos)' }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor">
            <path d="m10 8-4 4 4 4M14 8l4 4-4 4" strokeWidth="1.6" strokeLinecap="square" />
          </svg>
        </span>

        <span className="s-plaque u-label text-ink-70 pointer-events-none absolute top-3 left-3 z-10 px-2.5 py-1.5">
          {labels.before}
        </span>
        <span className="s-plaque u-label text-ink-70 pointer-events-none absolute top-3 right-3 z-10 px-2.5 py-1.5">
          {labels.after}
        </span>

        <label htmlFor={id} className="sr-only">
          {labels.control}
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          step={1}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-valuetext={`${labels.valueText} : ${100 - position} %`}
          className="ba-range absolute inset-0 z-20 h-full w-full"
        />
      </div>
      <figcaption className="u-meta mt-3">{labels.help}</figcaption>
    </figure>
  );
}
