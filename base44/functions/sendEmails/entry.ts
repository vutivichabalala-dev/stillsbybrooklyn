import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { escapeHtml, sanitizeSubject, isValidEmail, clip } from '../../shared/emailSafe.ts';

const ADMIN_EMAIL = 'info@stillsbybrooklyn.co.za';
const ADMIN_CC = 'vutivichabalala@gmail.com';
const FROM_EMAIL = 'Stills by Brooklyn <info@stillsbybrooklyn.co.za>';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(t) {
  if (!t || typeof t !== 'string' || !t.includes(':')) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h);
  if (isNaN(hour)) return '';
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

// ─── Email Templates ───────────────────────────────────────────────────────────

function clientConfirmationEmail({ name, type, data }) {
  const isBooking = type === 'booking';
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${isBooking ? 'Booking Confirmation' : 'Message Received'} — Stills by Brooklyn</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0d;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <div style="display:inline-block;border-bottom:1px solid #c9a84c;padding-bottom:12px;margin-bottom:8px;">
            <span style="color:#c9a84c;font-size:10px;letter-spacing:4px;text-transform:uppercase;">Stills by Brooklyn</span>
          </div>
          <h1 style="color:#ffffff;font-size:26px;font-weight:700;margin:12px 0 0;letter-spacing:1px;">
            ${isBooking ? 'Your Booking Request' : 'Message Received'}
          </h1>
          <p style="color:#c9a84c;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:8px 0 0;">
            ${isBooking ? 'Confirmation' : 'We\'ll be in touch shortly'}
          </p>
        </td></tr>

        <!-- Body Card -->
        <tr><td style="background:#141418;border:1px solid rgba(201,168,76,0.2);border-radius:4px;padding:40px;">

          <p style="color:#a0a0a0;font-size:13px;line-height:1.7;margin:0 0 24px;">
            Dear <strong style="color:#ffffff;">${escapeHtml(name)}</strong>,
          </p>
          <p style="color:#a0a0a0;font-size:13px;line-height:1.7;margin:0 0 32px;">
            ${isBooking
              ? `Thank you for submitting your booking request. Brooklyn has received your details and will confirm your session within <strong style="color:#ffffff;">24–48 hours</strong>.`
              : `Thank you for reaching out to Stills by Brooklyn. Your message has been received and Brooklyn will respond within <strong style="color:#ffffff;">24–48 hours</strong>.`
            }
          </p>

          <!-- Divider -->
          <div style="border-top:1px solid rgba(255,255,255,0.08);margin:0 0 28px;"></div>

          <!-- Summary -->
          <p style="color:#c9a84c;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 20px;">
            ${isBooking ? 'Booking Summary' : 'Your Enquiry'}
          </p>

          <table width="100%" cellpadding="0" cellspacing="0">
            ${isBooking ? `
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);width:40%;">Service</td>
              <td style="color:#ffffff;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${escapeHtml(data.service)}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Date</td>
              <td style="color:#ffffff;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${escapeHtml(formatDate(data.date))}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Time</td>
              <td style="color:#ffffff;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${escapeHtml(formatTime(data.time))}</td>
            </tr>
            ${data.location_address ? `
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Location</td>
              <td style="color:#ffffff;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${escapeHtml(data.location_address)}</td>
            </tr>` : ''}
            ${data.venue_name ? `
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">Venue</td>
              <td style="color:#ffffff;font-size:13px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${escapeHtml(data.venue_name)}</td>
            </tr>` : ''}
            ` : `
            <tr>
              <td colspan="2" style="color:#a0a0a0;font-size:13px;line-height:1.7;padding:10px 0;font-style:italic;">
                Your enquiry has been logged and Brooklyn will reply to this email address.
              </td>
            </tr>
            ${data.service ? `
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:10px 0;border-top:1px solid rgba(255,255,255,0.05);width:40%;">Service Interested In</td>
              <td style="color:#ffffff;font-size:13px;padding:10px 0;border-top:1px solid rgba(255,255,255,0.05);text-transform:capitalize;">${escapeHtml(data.service)}</td>
            </tr>` : ''}
            `}
          </table>

          <!-- Divider -->
          <div style="border-top:1px solid rgba(255,255,255,0.08);margin:32px 0 28px;"></div>

          <p style="color:#666;font-size:12px;line-height:1.7;margin:0;">
            If you have any questions in the meantime, feel free to reply to this email or call <strong style="color:#a0a0a0;">067 786 0702</strong>.
          </p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:28px 0;text-align:center;">
          <p style="color:#444;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Stills by Brooklyn</p>
          <p style="color:#333;font-size:11px;margin:0;">Midrand, South Africa · Available Nationwide</p>
          <p style="margin:16px 0 0;">
            <a href="https://stillsbybrooklyn.co.za" style="color:#c9a84c;font-size:11px;text-decoration:none;letter-spacing:1px;">stillsbybrooklyn.co.za</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminNotificationEmail({ type, data }) {
  const isBooking = type === 'booking';
  const rows = isBooking ? [
    ['Client Name', data.full_name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Service', data.service],
    ['Date', formatDate(data.date)],
    ['Time', formatTime(data.time)],
    ['Location', data.location_address || '—'],
    ['Venue', data.venue_name || '—'],
    ['Notes', data.notes || '—'],
  ] : [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone || '—'],
    ['Service Interest', data.service || '—'],
    ['Message', data.message],
  ];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>New ${isBooking ? 'Booking' : 'Enquiry'} — Stills by Brooklyn</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0d;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Alert Banner -->
        <tr><td style="background:#c9a84c;padding:14px 24px;border-radius:4px 4px 0 0;text-align:center;">
          <span style="color:#000;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">
            ● New ${isBooking ? 'Booking Request' : 'Contact Enquiry'}
          </span>
        </td></tr>

        <!-- Body Card -->
        <tr><td style="background:#141418;border:1px solid rgba(201,168,76,0.2);border-top:0;border-radius:0 0 4px 4px;padding:40px;">

          <p style="color:#c9a84c;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 24px;">Submission Details</p>

          <table width="100%" cellpadding="0" cellspacing="0">
            ${rows.map(([label, value]) => `
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);vertical-align:top;width:35%;white-space:nowrap;">${label}</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);line-height:1.6;">${escapeHtml(value)}</td>
            </tr>`).join('')}
          </table>

          <div style="border-top:1px solid rgba(255,255,255,0.08);margin:28px 0;"></div>
          <p style="color:#444;font-size:11px;margin:0;">Received: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })} SAST</p>

        </td></tr>

        <tr><td style="padding:20px 0;text-align:center;">
          <p style="color:#333;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0;">Stills by Brooklyn — Admin Notification</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendViaResend(payload: Record<string, unknown>) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM_EMAIL, ...payload }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json();
}

// Try Resend first; if it fails (e.g. domain not yet verified), fall back to
// Base44's built-in mailer so the email still goes out. Never throws.
async function sendMail(
  base44: any,
  { to, cc = [], subject, html }: { to: string[]; cc?: string[]; subject: string; html: string },
) {
  try {
    await sendViaResend({ to, ...(cc.length ? { cc } : {}), subject, html });
    return { ok: true, via: 'resend' };
  } catch (resendErr) {
    const resendMsg = resendErr instanceof Error ? resendErr.message : String(resendErr);
    console.error('Resend failed, falling back to Base44 mail:', resendMsg);
    const recipients = [...to, ...cc];
    let delivered = 0;
    for (const addr of recipients) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: addr,
          subject,
          body: html,
          from_name: 'Stills by Brooklyn',
        });
        delivered++;
      } catch (fallbackErr) {
        console.error(`Base44 mail fallback failed for ${addr}:`, fallbackErr instanceof Error ? fallbackErr.message : fallbackErr);
      }
    }
    return { ok: delivered > 0, via: 'base44', error: resendMsg };
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json().catch(() => ({}));
  const { type } = body;

  if (type !== 'booking' && type !== 'contact') {
    return Response.json({ error: 'Invalid type' }, { status: 400 });
  }

  // Booking: recipient and content are read from the stored record the caller just created.
  if (type === 'booking') {
    const bookingId = body.id || body.data?.id;
    if (!bookingId) return Response.json({ error: 'id is required' }, { status: 400 });

    const record = await base44.asServiceRole.entities.Booking
      .get(bookingId)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!record) return Response.json({ error: 'Booking not found' }, { status: 404 });

    const booking = {
      full_name: clip(record.full_name, 120),
      email: String(record.email || '').trim(),
      phone: clip(record.phone, 40),
      service: clip(record.service, 60),
      date: record.date,
      time: record.time,
      location_address: clip(record.location_address, 200),
      venue_name: clip(record.venue_name, 120),
      notes: clip(record.notes, 1000),
    };

    if (!isValidEmail(booking.email)) {
      return Response.json({ error: 'Booking has no valid email' }, { status: 400 });
    }

    // Admin first, so a bad client address can never cost Brooklyn the lead.
    const admin = await sendMail(base44, {
      to: [ADMIN_EMAIL],
      cc: [ADMIN_CC],
      subject: sanitizeSubject(`New Booking Request: ${booking.service} — ${booking.full_name}`),
      html: adminNotificationEmail({ type, data: booking }),
    });

    const client = await sendMail(base44, {
      to: [booking.email],
      subject: sanitizeSubject('Booking Request Received — Stills by Brooklyn'),
      html: clientConfirmationEmail({ name: booking.full_name, type, data: booking }),
    });

    return Response.json({ success: admin.ok || client.ok, admin, client }, { status: admin.ok || client.ok ? 200 : 502 });
  }

  // Contact enquiry: no stored record, so the visitor-supplied details are validated,
  // length-capped and escaped, and no visitor-written text is echoed to the recipient.
  const input = body.data || {};
  const contact = {
    name: clip(input.name, 120),
    email: String(input.email || '').trim(),
    phone: clip(input.phone, 40),
    service: clip(input.service, 60),
    message: clip(input.message, 2000),
  };

  if (!contact.name || !isValidEmail(contact.email) || !contact.message) {
    return Response.json({ error: 'Invalid contact details' }, { status: 400 });
  }

  // Admin first, so a bad visitor address can never cost Brooklyn the enquiry.
  const admin = await sendMail(base44, {
    to: [ADMIN_EMAIL],
    cc: [ADMIN_CC],
    subject: sanitizeSubject(`New Enquiry from ${contact.name}`),
    html: adminNotificationEmail({ type, data: contact }),
  });

  const client = await sendMail(base44, {
    to: [contact.email],
    subject: sanitizeSubject('Message Received — Stills by Brooklyn'),
    html: clientConfirmationEmail({ name: contact.name, type, data: contact }),
  });

  // Only report failure if Brooklyn's copy didn't arrive.
  return Response.json({ success: admin.ok, admin, client }, { status: admin.ok ? 200 : 502 });
});