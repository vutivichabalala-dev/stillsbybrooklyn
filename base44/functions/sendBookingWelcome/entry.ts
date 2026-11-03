import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { escapeHtml, sanitizeSubject } from '../../shared/emailSafe.ts';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Triggered only by the Booking-create workflow, which runs as an app admin.
  const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { event, data } = await req.json().catch(() => ({}));
  if (event?.type !== 'create') {
    return Response.json({ error: 'Invalid event' }, { status: 400 });
  }

  const bookingId = data?.id || event?.entity_id || event?.data?.id;
  if (!bookingId) return Response.json({ error: 'Invalid event' }, { status: 400 });

  // Recipient and content come from the stored record, never from the request body.
  const booking = await base44.asServiceRole.entities.Booking
    .get(bookingId)
    .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
  if (!booking) return Response.json({ error: 'Booking not found' }, { status: 404 });

  const { full_name, email, service, date, time, location_address, venue_name } = booking;
  if (!email) return Response.json({ error: 'Booking has no email' }, { status: 400 });

  const bookingDate = new Date(date).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const safeName = escapeHtml(full_name);
  const safeService = escapeHtml(service);
  const safeTime = escapeHtml(time);
  const safeLocation = escapeHtml(venue_name || location_address || 'TBD');

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Montserrat', Arial, sans-serif; background-color: #030303; color: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0a0a0c 0%, #141418 100%); border: 1px solid rgba(255,215,0,0.2); border-radius: 12px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
    .header { background: linear-gradient(135deg, #1a1a1f 0%, #252530 100%); padding: 40px 30px; text-align: center; border-bottom: 2px solid #d4af37; }
    .header h1 { font-family: 'Cormorant Garamond', serif; font-size: 32px; margin: 0; color: #d4af37; font-weight: 300; letter-spacing: 2px; }
    .header p { color: #999; font-size: 12px; margin: 8px 0 0 0; letter-spacing: 1px; text-transform: uppercase; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 14px; color: #e5e5e5; margin-bottom: 20px; line-height: 1.6; }
    .booking-card { background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.3); border-radius: 8px; padding: 24px; margin: 24px 0; }
    .booking-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(212,175,55,0.15); }
    .booking-row:last-child { border-bottom: none; }
    .booking-label { color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .booking-value { color: #d4af37; font-weight: 600; font-size: 14px; }
    .cta { text-align: center; margin: 30px 0; }
    .button { display: inline-block; padding: 12px 32px; background: #d4af37; color: #030303; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; transition: all 0.3s; }
    .button:hover { background: #e5c158; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(212,175,55,0.3); }
    .footer { border-top: 1px solid rgba(255,255,255,0.1); padding: 24px 30px; text-align: center; color: #666; font-size: 11px; }
    .footer p { margin: 6px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Stills by Brooklyn</h1>
      <p>✦ Professional Photography ✦</p>
    </div>
    <div class="content">
      <div class="greeting">
        <p>Hello <strong>${safeName}</strong>,</p>
        <p>Thank you for booking with us! We're excited to capture your moment. Your booking has been received and we're already looking forward to working with you.</p>
      </div>
      <div class="booking-card">
        <div class="booking-row">
          <span class="booking-label">Service</span>
          <span class="booking-value">${safeService}</span>
        </div>
        <div class="booking-row">
          <span class="booking-label">Date</span>
          <span class="booking-value">${bookingDate}</span>
        </div>
        <div class="booking-row">
          <span class="booking-label">Time</span>
          <span class="booking-value">${safeTime}</span>
        </div>
        <div class="booking-row">
          <span class="booking-label">Location</span>
          <span class="booking-value">${safeLocation}</span>
        </div>
      </div>
      <p style="color: #ccc; font-size: 13px; line-height: 1.6;">
        A confirmation email with final details will be sent within 24 hours. If you have any questions or need to reschedule, don't hesitate to reach out.
      </p>
      <div class="cta">
        <a href="mailto:info@stillsbybrooklyn.co.za" class="button">Get in Touch</a>
      </div>
    </div>
    <div class="footer">
      <p><strong>Stills by Brooklyn</strong> | Professional Photography</p>
      <p>Midrand, South Africa • Available Nationwide</p>
      <p>📧 info@stillsbybrooklyn.co.za | 🌐 stillsbybrooklyn.co.za</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  await base44.asServiceRole.integrations.Core.SendEmail({
    to: email.trim(),
    subject: sanitizeSubject(`📷 Booking Confirmed — ${service || 'Session'} on ${bookingDate}`),
    body: htmlBody,
    from_name: 'Stills by Brooklyn',
  });

  return Response.json({ success: true });
});