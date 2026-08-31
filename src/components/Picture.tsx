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
 * The default <source> in a <picture> needs no media query — it is whatever is
 * left once the earlier ones have failed. A <link rel="preload"> has no such
 * ordering, so an unqualified one matches everywhere and a desktop browser
 * would fetch the wide crop AND the mobile crop.
 *
 * This reconstructs the "left over" condition as a plain max-width just under
 * the narrowest breakpoint above it. The obvious spelling — `not all and
 * (min-width: 40rem)` — is valid CSS and evaluates correctly once the page is
 * live, but Chrome's preload scanner fetches it anyway, which is the exact
 * waste this function exists to prevent.
 */
function fallbackMedia(sources: Source[]): string | undefined {
  const narrowest = sources
    .map((s) => s.media?.match(/min-width:\s*([\d.]+)(rem|px|em)/))
    .filter((m): m is RegExpMatchArray => Boolean(m))
    .at(-1);
  if (!narrowest) return undefined;
  // 0.01 below the breakpoint, so the two ranges meet without overlapping.
  const value = Number(narrowest[1]) - 0.01;
  return `(max-width: ${value}${narrowest[2]})`;
}

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
      {/* The LCP image is discovered by the preload scanner only after the
          stylesheet and the markup above it have parsed. Preloading the AVIF
          candidate set — with the same media query and sizes the <source>
          uses, so the browser picks the identical file — starts the request
          in the first round trip instead of the third. React hoists these
          into <head>. */}
      {priority
        ? sources.map((s, i) => (
            <link
              key={`preload-${i}`}
              rel="preload"
              as="image"
              type="image/avif"
              media={s.media ?? fallbackMedia(sources)}
              imageSrcSet={s.srcSet.avif}
              imageSizes={sizes}
              fetchPriority="high"
            />
          ))
        : null}
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
