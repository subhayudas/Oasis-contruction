import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/**
 * eslint-config-next 16 ships native flat configs, so they are imported
 * directly. Routing them through FlatCompat - the bridge for the old
 * .eslintrc format - makes the validator try to JSON.stringify a config
 * object that references its own plugins, and the whole run dies on a
 * circular structure before a single file is checked.
 */
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ['.next/**', 'node_modules/**', 'public/**', 'assets/**', 'scripts/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      /**
       * The site serves pre-generated AVIF/WebP/JPEG derivatives with real art
       * direction through <Picture>, and the brand marks are fixed-size PNGs.
       * next/image would add a runtime optimiser that has nothing left to do.
       */
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
