import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const ADMIN_EMAIL = 'info@stillsbybrooklyn.co.za';
const ADMIN_CC = 'vutivichabalala@gmail.com';
const FROM_EMAIL = 'Stills by Brooklyn <info@stillsbybrooklyn.co.za>';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    // Check admin access
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch last booking (most recent)
    const bookings = await base44.entities.Booking.list('-created_date', 1);
    
    if (!bookings || bookings.length === 0) {
      return Response.json({ error: 'No booking submissions found' }, { status: 404 });
    }

    const data = bookings[0];
    const clientName = data.full_name;
    const clientEmail = data.email;

    // Format functions
    function formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    function formatTime(t) {
      if (!t) return '';
      const [h, m] = t.split(':');
      const hour = parseInt(h);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h12 = hour % 12 || 12;
      return `${h12}:${m} ${ampm}`;
    }

    // Admin notification email
    const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>New Booking (Resent) — Stills by Brooklyn</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0d;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#c9a84c;padding:14px 24px;border-radius:4px 4px 0 0;text-align:center;">
          <span style="color:#000;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">
            ● Booking Request (RESENT)
          </span>
        </td></tr>
        <tr><td style="background:#141418;border:1px solid rgba(201,168,76,0.2);border-top:0;border-radius:0 0 4px 4px;padding:40px;">
          <p style="color:#c9a84c;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 24px;">Booking Details</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:35%;">Client Name</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${data.full_name}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:35%;">Email</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${data.email}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:35%;">Phone</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${data.phone}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:35%;">Service</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${data.service}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:35%;">Date</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${formatDate(data.date)}</td>
            </tr>
            <tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:35%;">Time</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${formatTime(data.time)}</td>
            </tr>
            ${data.location_address ? `<tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:35%;">Location</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${data.location_address}</td>
            </tr>` : ''}
            ${data.venue_name ? `<tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:35%;">Venue</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${data.venue_name}</td>
            </tr>` : ''}
            ${data.notes ? `<tr>
              <td style="color:#666;font-size:11px;letter-spacing:1px;text-transform:uppercase;padding:12px 16px 12px 0;border-bottom:1px solid rgba(255,255,255,0.06);width:35%;">Notes</td>
              <td style="color:#ffffff;font-size:13px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);">${data.notes}</td>
            </tr>` : ''}
          </table>
          <div style="border-top:1px solid rgba(255,255,255,0.08);margin:28px 0;"></div>
          <p style="color:#444;font-size:11px;margin:0;">Resent: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })} SAST</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    // Send to admin
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        cc: [ADMIN_CC],
        subject: `Booking Request (Resent): ${data.service} — ${clientName}`,
        html: adminHtml,
      }),
    });

    return Response.json({ 
      success: true,
      message: `Resent booking from ${clientName}`,
      booking: { id: data.id, name: clientName, email: clientEmail, service: data.service }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});