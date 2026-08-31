import type { MetadataRoute } from 'next';

import { absolute, BASE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    // /lp/ is paid-traffic only and carries a noindex header of its own;
    // disallowing it here as well keeps it out of the crawl budget entirely.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/lp/'] }],
    sitemap: absolute('/sitemap.xml'),
    host: BASE_URL,
  };
}
