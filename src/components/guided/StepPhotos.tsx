'use client';

import { useEffect, useMemo, useState } from 'react';

import type { GuidedCopy } from '@/content/guided';
import { IconArrow, IconClose, IconUpload } from '@/components/icons';
import { ACCEPTED_EXTENSIONS, ACCEPTED_IMAGE_TYPES } from '@/lib/contact';
import type { GuidedFileError } from '@/lib/guided';
import { guidedFileLimits } from '@/lib/guided';
import { StepHeader } from './StepHeader';

/**
 * Step 5. Optional, and honestly labelled.
 *
 * `accept="image/*"` is what makes iOS and Android offer the camera as well
 * as the library - the point of asking here is that someone standing on their
 * own driveway can photograph the crack and send it in one motion.
 *
 * The disclaimer under the drop zone is not legal boilerplate. A photograph
 * cannot diagnose a settled base or a failed drain, and a form that implies
 * it can spends the trust the on-site visit is supposed to earn. It says
 * "première impression", and it says the site visit is free.
 */
export function StepPhotos({
  copy,
  photos,
  error,
  onAdd,
  onRemove,
  onContinue,
  onSkip,
}: {
  copy: GuidedCopy;
  photos: File[];
  error: GuidedFileError | null;
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const { maxFiles } = guidedFileLimits;

  /* Derived rather than stored, so a thumbnail can never outlive the file it
     belongs to; the effect hands each URL back when it is replaced. Without
     it, every swapped photograph leaks its whole self until the tab closes. */
  const previews = useMemo(() => photos.map((file) => URL.createObjectURL(file)), [photos]);
  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  const full = photos.length >= maxFiles;

  return (
    <div className="flex flex-col gap-6">
      <StepHeader question={copy.photos.question} hint={copy.photos.hint} />

      <div>
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            onAdd(Array.from(event.dataTransfer.files));
          }}
          data-dragging={dragging ? 'true' : 'false'}
          data-invalid={error ? 'true' : 'false'}
          data-compact={photos.length > 0 ? 'true' : 'false'}
          className="g-drop"
        >
          <input
            type="file"
            multiple
            disabled={full}
            accept={`image/*,${ACCEPTED_IMAGE_TYPES.join(',')},${ACCEPTED_EXTENSIONS}`}
            aria-label={photos.length > 0 ? copy.photos.addMore : copy.photos.dropMobile}
            aria-invalid={error ? true : undefined}
            onChange={(event) => {
              onAdd(Array.from(event.target.files ?? []));
              // Let the same file be picked again after a removal.
              event.target.value = '';
            }}
            className="g-drop-input disabled:cursor-not-allowed"
          />
          <span className="pointer-events-none flex flex-col items-center gap-2 text-center">
            <IconUpload className="text-brass-deep h-7 w-7" />
            {/* Two labels, swapped in CSS rather than by measuring the
                viewport in JavaScript: a hook would render the desktop
                wording on the server and correct it after hydration, which
                is a flash of the wrong instruction on exactly the device
                the instruction is for. */}
            <span className="text-ink text-[0.9375rem] font-[600]">
              {photos.length > 0 ? (
                copy.photos.addMore
              ) : (
                <>
                  <span className="sm:hidden">{copy.photos.dropMobile}</span>
                  <span className="hidden sm:inline">{copy.photos.dropDesktop}</span>
                </>
              )}
            </span>
            <span className="u-meta">{copy.photos.constraints}</span>
          </span>
        </div>

        {error ? (
          <p role="alert" className="mt-2.5 text-[0.8125rem] text-[var(--color-danger-deep)]">
            {copy.photos.errors[error]}
          </p>
        ) : null}

        {photos.length > 0 ? (
          <>
            <p className="u-meta mt-3">{copy.photos.counter(photos.length, maxFiles)}</p>
            <ul className="mt-2 flex flex-wrap gap-3">
              {photos.map((file, index) => (
                <li key={`${file.name}-${file.size}-${index}`} className="relative">
                  <span className="frame frame-keyline block h-20 w-20">
                    {previews[index] ? (
                      // A local object URL for a file the visitor just picked;
                      // next/image cannot optimise a blob and would gain nothing.
                      <img
                        src={previews[index]}
                        alt={`${copy.photos.previewLabel} - ${file.name}`}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    aria-label={`${copy.photos.remove} - ${file.name}`}
                    className="bg-ink text-paper absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-[0_2px_6px_rgba(26,22,16,0.4)]"
                  >
                    <IconClose className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <p className="u-meta border-l-2 border-[var(--color-brass)] pl-3.5 text-[0.8125rem] leading-[1.55]">
        {copy.photos.disclaimer}
      </p>

      {/* One key, not two. With a photograph attached "Continuer" and
          "Passer" would do the same thing under different names, and a
          choice between two identical outcomes is friction, not agency.
          The skip is an outlined key rather than a text link so it clears
          44px on a thumb - it is the majority path, not a footnote. */}
      {photos.length > 0 ? (
        <button type="button" onClick={onContinue} className="btn btn-stone w-full">
          {copy.photos.continue}
          <IconArrow className="h-4 w-4" />
        </button>
      ) : (
        <button type="button" onClick={onSkip} className="btn btn-quarry w-full">
          {copy.photos.skip}
          <IconArrow className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
