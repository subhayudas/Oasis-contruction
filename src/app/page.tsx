import { redirect } from 'next/navigation';

import { defaultLocale } from '@/lib/i18n';

/**
 * The proxy normally redirects "/" to a locale before this renders; this is
 * the fallback for any environment where the proxy does not run.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
