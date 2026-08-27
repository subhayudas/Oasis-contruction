import type { Source } from '@/lib/images';

type Props = {
  /**
   * Art-directed crops, widest breakpoint first. The last entry is the default
   * and supplies the intrinsic width/height that reserves layout space.
   */
  sources: Source[];
  alt: string;
  /** Sizes hint for the browser's srcset picker. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  /** Set only on the true LCP image. */
  priority?: boolean;
};

/**
 * Serves pre-generated AVIF / WebP / JPEG derivatives with real art direction.
 * No runtime image optimisation, no client JavaScript, explicit intrinsic size
 * on the <img> so nothing shifts while the picture decodes.
 */
export function Picture({
  sources,
  alt,
  sizes,
  className,
  imgClassName,
  priority = false,
}: Props) {
  const base = sources[sources.length - 1];
  if (!base) return null;

  return (
    <picture className={className}>
      {sources.flatMap((s, i) =>
        (['avif', 'webp'] as const).map((type) => (
          <source
            key={`${i}-${type}`}
            type={`image/${type}`}
            media={s.media}
            srcSet={s.srcSet[type]}
            sizes={sizes}
            width={s.width}
            height={s.height}
          />
        )),
      )}
      {sources.slice(0, -1).map((s, i) => (
        <source
          key={`jpg-${i}`}
          type="image/jpeg"
          media={s.media}
          srcSet={s.srcSet.jpeg}
          sizes={sizes}
          width={s.width}
          height={s.height}
        />
      ))}
      <img
        src={base.fallback}
        srcSet={base.srcSet.jpeg}
        sizes={sizes}
        alt={alt}
        width={base.width}
        height={base.height}
        className={imgClassName}
        loading={priority ? 'eager' : 'lazy'}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fetchPriority={(priority ? 'high' : 'auto') as any}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  );
}
