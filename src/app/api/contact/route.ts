import { NextResponse, type NextRequest } from 'next/server';

import { services } from '@/content/services';
import { site } from '@/content/site';
import {
  MAX_FILES,
  MAX_FILE_BYTES,
  ACCEPTED_IMAGE_TYPES,
  isServiceKey,
  validateContact,
  validateFiles,
  type ContactPayload,
  type ContactResponse,
  type ContactVariant,
} from '@/lib/contact';
import { isLocale } from '@/lib/i18n';
import { verifyRecaptcha } from '@/lib/recaptcha';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ---------------------------------------------------------- rate limiting */

/**
 * Best-effort, in-process throttle: enough to stop a bored bot, and honest
 * about its limits — it resets on deploy and is per-instance. Put a real
 * rate limiter in front of the site if you need a guarantee.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  return (forwarded?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim();
}

/* --------------------------------------------------------------- delivery */

type Attachment = { filename: string; content: string; contentType: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function serviceLabel(key: string): string {
  if (key === 'other') return 'Autre / non précisé';
  if (!isServiceKey(key)) return key || '—';
  return services.find((s) => s.key === key)?.copy.fr.name ?? key;
}

function subjectLabel(value: string): string {
  if (value === 'quote') return 'Devis';
  if (value === 'question') return 'Question';
  if (value === 'other') return 'Autre';
  return '—';
}

function renderEmail(payload: ContactPayload, fileNames: string[]): string {
  const rows: [string, string][] = [
    ['Nom', payload.name],
    ['Téléphone', payload.phone || '—'],
    ['Courriel', payload.email || '—'],
    ['Service', serviceLabel(payload.service)],
    ['Sujet', subjectLabel(payload.subject)],
    ['Ville', payload.city || '—'],
    ['Depuis quand', payload.duration || '—'],
    ['Contact préféré', payload.preferred],
    ['Langue du site', payload.locale],
    ['Photos', fileNames.length ? fileNames.join(', ') : '—'],
  ];

  return `<!doctype html><html lang="fr"><body style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#221c16;background:#f3efe1;padding:24px;">
<h1 style="font-size:18px;margin:0 0 4px;">Nouvelle demande de soumission</h1>
<p style="margin:0 0 20px;color:#6b6053;font-size:13px;">oasis-construction.ca</p>
<table style="border-collapse:collapse;width:100%;max-width:640px;background:#fffdf6;">
${rows
  .map(
    ([label, value]) =>
      `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e3d9c2;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#835a02;width:150px;">${escapeHtml(
        label,
      )}</th><td style="padding:8px 12px;border-bottom:1px solid #e3d9c2;font-size:14px;">${escapeHtml(
        value,
      )}</td></tr>`,
  )
  .join('')}
</table>
<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:#835a02;margin:24px 0 8px;">Description du projet</h2>
<div style="background:#fffdf6;padding:12px 14px;font-size:14px;line-height:1.6;white-space:pre-wrap;max-width:640px;">${escapeHtml(
    payload.message,
  )}</div>
</body></html>`;
}

const FORM_LABEL: Record<ContactVariant, string> = {
  general: 'Demande de devis',
  photo: 'Envoi de photo',
  contact: 'Page contact',
};

async function deliver(
  payload: ContactPayload,
  attachments: Attachment[],
  variant: ContactVariant,
): Promise<'sent' | 'not_configured' | 'failed'> {
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  const subject = `${FORM_LABEL[variant]} — ${payload.name}${
    payload.city ? ` (${payload.city})` : ''
  }`;

  if (resendKey && to && from) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: to.split(',').map((address) => address.trim()),
          subject,
          reply_to: payload.email || undefined,
          html: renderEmail(
            payload,
            attachments.map((a) => a.filename),
          ),
          attachments: attachments.map((a) => ({
            filename: a.filename,
            content: a.content,
          })),
        }),
      });
      if (!response.ok) {
        console.error('[contact] Resend rejected the message', response.status);
        return 'failed';
      }
      return 'sent';
    } catch (error) {
      console.error('[contact] Resend request failed', error);
      return 'failed';
    }
  }

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          subject,
          formSubject: payload.subject,
          form: variant,
          website: undefined,
          elapsed: undefined,
          attachments: attachments.map((a) => ({
            filename: a.filename,
            contentType: a.contentType,
          })),
        }),
      });
      if (!response.ok) {
        console.error('[contact] Webhook rejected the message', response.status);
        return 'failed';
      }
      return 'sent';
    } catch (error) {
      console.error('[contact] Webhook request failed', error);
      return 'failed';
    }
  }

  return 'not_configured';
}

/* ----------------------------------------------------------------- route */

function json(body: ContactResponse, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, code: 'validation' }, 400);
  }

  const read = (key: string) => {
    const value = form.get(key);
    return typeof value === 'string' ? value : '';
  };

  const preferredRaw = read('preferred');
  const payload: ContactPayload = {
    name: read('name').slice(0, 120),
    email: read('email').slice(0, 160),
    phone: read('phone').slice(0, 40),
    service: read('service').slice(0, 40),
    subject: read('subject').slice(0, 40),
    city: read('city').slice(0, 80),
    message: read('message').slice(0, 4000),
    duration: read('duration').slice(0, 200),
    preferred:
      preferredRaw === 'phone' || preferredRaw === 'email' || preferredRaw === 'either'
        ? preferredRaw
        : 'either',
    consent: read('consent') === 'true' || read('consent') === 'on',
    locale: isLocale(read('locale')) ? read('locale') : 'fr',
    website: read('website'),
    elapsed: Number.parseInt(read('elapsed'), 10) || 0,
  };

  // Honeypot, and a floor on how fast a human can fill this in.
  if (payload.website.trim() !== '' || (payload.elapsed > 0 && payload.elapsed < 2000)) {
    return json({ ok: false, code: 'rejected' }, 400);
  }

  if (rateLimited(clientKey(request))) {
    return json({ ok: false, code: 'rate_limited' }, 429);
  }

  // No-op until RECAPTCHA_SECRET_KEY and the public site key are both set.
  const captcha = await verifyRecaptcha(read('recaptcha'), clientKey(request));
  if (!captcha.ok) {
    console.warn(`[contact] reCAPTCHA rejected a submission: ${captcha.reason}`);
    return json({ ok: false, code: 'rejected' }, 400);
  }

  const requested = read('variant');
  const variant: ContactVariant = (['general', 'photo', 'contact'] as const).includes(
    requested as ContactVariant,
  )
    ? (requested as ContactVariant)
    : 'general';
  const errors = validateContact(payload, variant);

  const files = form
    .getAll('photos')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, MAX_FILES + 1);
  errors.push(...validateFiles(files, variant));

  if (errors.length > 0) {
    return json({ ok: false, code: 'validation', errors }, 422);
  }

  const attachments: Attachment[] = [];
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) continue;
    if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type)) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    attachments.push({
      // Never trust a client-supplied path; keep the extension only.
      filename: file.name.replace(/[^\w.-]+/g, '_').slice(-80) || 'photo.jpg',
      content: buffer.toString('base64'),
      contentType: file.type,
    });
  }

  const result = await deliver(payload, attachments, variant);

  if (result === 'not_configured') {
    console.warn(
      `[contact] No delivery provider configured. Set RESEND_API_KEY + CONTACT_TO_EMAIL + ` +
        `CONTACT_FROM_EMAIL, or CONTACT_WEBHOOK_URL. The visitor was shown the ` +
        `${site.phone.display} fallback instead of a false success.`,
    );
    return json({ ok: false, code: 'not_configured' }, 503);
  }
  if (result === 'failed') {
    return json({ ok: false, code: 'delivery_failed' }, 502);
  }

  return json({ ok: true }, 200);
}
