// Vercel serverless function: POST /api/send-email
// Sends booking and contact-form emails through Resend.
//
// Vercel environment variables:
//   RESEND_API_KEY  (required)  your Resend API key
//   RESEND_FROM     (optional)  defaults to "Stills by Brooklyn <info@stillsbybrooklyn.co.za>"
//   ADMIN_EMAIL     (optional)  defaults to info@stillsbybrooklyn.co.za
//   ADMIN_CC        (optional)  defaults to vutivichabalala@gmail.com

import { sanitizeSubject, isValidEmail, clip } from './_lib/emailSafe.js';
import { clientConfirmationEmail, adminNotificationEmail } from './_lib/templates.js';

const FROM_EMAIL = process.env.RESEND_FROM || 'Stills by Brooklyn <info@stillsbybrooklyn.co.za>';
// Resend's shared test sender. It only delivers to the Resend account owner's own
// address, so it's used as a last resort for Brooklyn's copy while the domain
// isn't verified yet.
const FALLBACK_FROM = 'Stills by Brooklyn <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@stillsbybrooklyn.co.za';
const ADMIN_CC = process.env.ADMIN_CC || 'vutivichabalala@gmail.com';

const SERVICES = ['Corporate', 'Portraits', 'Weddings', 'Graduations'];

async function resendSend(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    const err = new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// Never throws; reports what happened.
async function sendMail({ to, cc = [], subject, html, allowFallback = false }) {
  try {
    await resendSend({ from: FROM_EMAIL, to, ...(cc.length ? { cc } : {}), subject, html });
    return { ok: true };
  } catch (err) {
    console.error(`Send to ${to.join(', ')} failed:`, err.message);
    // 403/422 usually means the sending domain isn't verified yet.
    if (allowFallback && (err.status === 403 || err.status === 422)) {
      for (const addr of [...to, ...cc]) {
        try {
          await resendSend({ from: FALLBACK_FROM, to: [addr], subject, html });
          return { ok: true, fallback: true };
        } catch (e) {
          console.error(`Fallback send to ${addr} failed:`, e.message);
        }
      }
    }
    return { ok: false, error: err.message };
  }
}

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = readBody(req);
  const { type } = body;
  const input = body.data || {};

  // Honeypot: real visitors never fill this hidden field.
  if (input.website) return res.status(200).json({ success: true });

  let data;
  let adminSubject;
  let clientSubject;
  let clientName;

  if (type === 'booking') {
    data = {
      full_name: clip(input.full_name, 120).trim(),
      email: String(input.email || '').trim(),
      phone: clip(input.phone, 40).trim(),
      service: clip(input.service, 60),
      date: clip(input.date, 30),
      time: clip(input.time, 10),
      location_address: clip(input.location_address, 200),
      venue_name: clip(input.venue_name, 120),
      notes: clip(input.notes, 1000),
    };
    if (!data.full_name || !data.phone || !SERVICES.includes(data.service) || !data.date || !data.time) {
      return res.status(400).json({ error: 'Missing booking details' });
    }
    adminSubject = `New Booking Request: ${data.service} — ${data.full_name}`;
    clientSubject = 'Booking Request Received — Stills by Brooklyn';
    clientName = data.full_name;
  } else if (type === 'contact') {
    data = {
      name: clip(input.name, 120).trim(),
      email: String(input.email || '').trim(),
      phone: clip(input.phone, 40),
      service: clip(input.service, 60),
      message: clip(input.message, 2000).trim(),
    };
    if (!data.name || !data.message) {
      return res.status(400).json({ error: 'Missing contact details' });
    }
    adminSubject = `New Enquiry from ${data.name}`;
    clientSubject = 'Message Received — Stills by Brooklyn';
    clientName = data.name;
  } else {
    return res.status(400).json({ error: 'Invalid type' });
  }

  if (!isValidEmail(data.email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' });
  }

  // Brooklyn's copy first, so a bad visitor address never costs the lead.
  const admin = await sendMail({
    to: [ADMIN_EMAIL],
    cc: ADMIN_CC && ADMIN_CC !== ADMIN_EMAIL ? [ADMIN_CC] : [],
    subject: sanitizeSubject(adminSubject),
    html: adminNotificationEmail({ type, data }),
    allowFallback: true,
  });

  const client = await sendMail({
    to: [data.email],
    subject: sanitizeSubject(clientSubject),
    html: clientConfirmationEmail({ name: clientName, type, data }),
  });

  if (!admin.ok) {
    return res.status(502).json({ error: 'Email could not be sent', admin, client });
  }
  return res.status(200).json({ success: true, clientEmailSent: client.ok });
}
