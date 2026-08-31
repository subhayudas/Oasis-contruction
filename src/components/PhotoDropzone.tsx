'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { ACCEPTED_EXTENSIONS, ACCEPTED_IMAGE_TYPES, MAX_FILES } from '@/lib/contact';
import { IconClose, IconUpload } from './icons';

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  id: string;
  describedBy?: string;
  invalid?: boolean;
  labels: {
    drop: string;
    help: string;
    remove: string;
    previewLabel: string;
  };
};

/**
 * A large drop target with real thumbnails.
 *
 * `accept="image/*"` is what makes iOS and Android offer the camera as well as
 * the library, which is the point of the whole funnel: someone standing on
 * their own driveway looking at the crack should be able to photograph it and
 * send it in one motion.
 *
 * Object URLs are revoked when the preview goes away - otherwise every photo a
 * visitor swaps out leaks the whole file until the tab closes.
 */
export function PhotoDropzone({ files, onChange, id, describedBy, invalid, labels }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  /* Deriving the URLs rather than storing them keeps the thumbnails in the
     same render as the files they belong to; the effect below exists only to
     hand each one back when it is replaced. */
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  function accept(incoming: FileList | null) {
    if (!incoming) return;
    // One more than the maximum, so the count error can actually fire rather
    // than the extra file being silently dropped.
    onChange([...files, ...Array.from(incoming)].slice(0, MAX_FILES + 1));
  }

  return (
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
          accept(event.dataTransfer.files);
        }}
        data-dragging={dragging ? 'true' : 'false'}
        className="dropzone"
        data-invalid={invalid ? 'true' : 'false'}
      >
        <input
          ref={inputRef}
          id={id}
          name="photos"
          type="file"
          multiple
          accept={`image/*,${ACCEPTED_IMAGE_TYPES.join(',')},${ACCEPTED_EXTENSIONS}`}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={(event) => {
            accept(event.target.files);
            // Let the same file be picked again after a removal.
            event.target.value = '';
          }}
          className="dropzone-input"
        />
        <span className="pointer-events-none flex flex-col items-center gap-2 text-center">
          <IconUpload className="text-brass-deep h-7 w-7" />
          <span className="text-ink text-[0.9375rem] font-[550]">{labels.drop}</span>
          <span className="u-meta">{labels.help}</span>
        </span>
      </div>

      {files.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-3">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="relative">
              <span className="frame frame-keyline block h-24 w-24">
                {previews[index] ? (
                  // A local object URL for a file the visitor just picked;
                  // next/image would gain nothing and cannot optimise a blob.
                  <img
                    src={previews[index]}
                    alt={`${labels.previewLabel} - ${file.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, i) => i !== index))}
                aria-label={`${labels.remove} - ${file.name}`}
                className="bg-ink text-paper absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full shadow-[0_2px_6px_rgba(26,22,16,0.4)]"
              >
                <IconClose className="h-3.5 w-3.5" />
              </button>
              <span className="u-meta mt-1 block max-w-24 truncate">
                {(file.size / (1024 * 1024)).toFixed(1)} Mo
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
