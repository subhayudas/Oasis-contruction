import localFont from 'next/font/local';

/**
 * Both families are vendored, subset to the Latin + French glyphs the site
 * actually uses (60 KB for all three files), and self-hosted through
 * next/font — no third-party request, no flash of unstyled text, and the
 * metric overrides below keep the fallback from shifting the layout.
 */
export const geist = localFont({
  src: [{ path: '../fonts/geist-variable.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-geist',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
  adjustFontFallback: 'Arial',
});

export const instrumentSerif = localFont({
  src: [
    { path: '../fonts/instrument-serif-regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/instrument-serif-italic.woff2', weight: '400', style: 'italic' },
  ],
  variable: '--font-instrument',
  display: 'swap',
  preload: true,
  fallback: ['ui-serif', 'Georgia', 'Times New Roman', 'serif'],
  adjustFontFallback: 'Times New Roman',
});
