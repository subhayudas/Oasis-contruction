/**
 * The client's circular mark, at the size it is actually drawn.
 *
 * The 512px PNG is a 248 KB file being painted into a 44 px box, and React
 * preloads it eagerly because it is above the fold — so it was the single
 * heaviest thing on every page for no visible gain. This serves a 128 px WebP
 * (6.6 KB) with a 192 px PNG fallback, and lets a 2× screen take the 192.
 *
 * The artwork itself is untouched — no redraw, no trace.
 */
export function BrandMark({
  alt,
  size = 44,
  className = '',
}: {
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet="/brand/oasis-logo-128.webp 128w, /brand/oasis-logo-192.webp 192w"
        sizes={`${size}px`}
      />
      <img
        src="/brand/oasis-logo-192.png"
        srcSet="/brand/oasis-logo-128.png 128w, /brand/oasis-logo-192.png 192w"
        sizes={`${size}px`}
        alt={alt}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={className}
      />
    </picture>
  );
}
