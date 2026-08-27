import manifest from '@/content/image-manifest.json';

type ManifestSize = { w: number; h: number };
type ManifestVariant = {
  ratio: string;
  aspect: number;
  path: string;
  sizes: ManifestSize[];
};
type ManifestEntry = { origin: string; variants: Record<string, ManifestVariant> };

const images = manifest as unknown as Record<string, ManifestEntry>;

export type PhotoId = keyof typeof manifest;

export type Source = {
  /** Intrinsic size of the largest derivative — used to prevent layout shift. */
  width: number;
  height: number;
  aspect: number;
  srcSet: { avif: string; webp: string; jpeg: string };
  fallback: string;
  /** Art-direction breakpoint, e.g. '(min-width: 64rem)'. */
  media?: string;
};

function variantOf(id: string, variant: string): ManifestVariant {
  const entry = images[id];
  if (!entry) throw new Error(`Unknown image "${id}" in the image manifest.`);
  const found = entry.variants[variant];
  if (!found) {
    throw new Error(
      `Unknown variant "${variant}" for image "${id}". Available: ${Object.keys(
        entry.variants,
      ).join(', ')}`,
    );
  }
  return found;
}

/** Build the AVIF/WebP/JPEG srcsets for one art-directed crop. */
export function source(id: string, variant: string, media?: string): Source {
  const v = variantOf(id, variant);
  const largest = v.sizes[v.sizes.length - 1] as ManifestSize;
  const set = (ext: string) => v.sizes.map((s) => `${v.path}-${s.w}.${ext} ${s.w}w`).join(', ');
  return {
    width: largest.w,
    height: largest.h,
    aspect: v.aspect,
    srcSet: { avif: set('avif'), webp: set('webp'), jpeg: set('jpg') },
    fallback: `${v.path}-${largest.w}.jpg`,
    media,
  };
}

export function imageOrigin(id: string): string {
  return images[id]?.origin ?? '';
}

export const logoSrc = {
  png: '/brand/oasis-logo-512.png',
  webp: '/brand/oasis-logo-512.webp',
  large: '/brand/oasis-logo-1024.png',
};
