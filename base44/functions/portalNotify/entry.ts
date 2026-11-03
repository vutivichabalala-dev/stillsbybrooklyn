import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { escapeHtml, sanitizeSubject, isValidEmail, clip } from '../../shared/emailSafe.ts';

const ADMIN_EMAIL = 'info@stillsbybrooklyn.co.za';
const FROM = 'info@stillsbybrooklyn.co.za';
const DEFAULT_PORTAL_URL = 'https://stillsbybrooklyn.co.za/portal';

async function sendEmail(to, subject, html) {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `Stills by Brooklyn <${FROM}>`, to, subject: sanitizeSubject(subject), html }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return res.json();
}

function safeUrl(url) {
  const value = String(url || '').trim();
  return /^https:\/\/[^\s"'<>]+$/i.test(value) && value.length <= 400 ? value : DEFAULT_PORTAL_URL;
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, data } = await req.json().catch(() => ({}));
  const isAdmin = user.role === 'admin';

  if (type === 'selections_submitted') {
    const galleryId = data?.galleryId;
    if (!galleryId) return Response.json({ error: 'galleryId is required' }, { status: 400 });

    // Everything below is derived from stored records, never from the request body.
    const gallery = await base44.asServiceRole.entities.Gallery
      .get(galleryId)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!gallery) return Response.json({ error: 'Gallery not found' }, { status: 404 });

    const client = gallery.client_id
      ? await base44.asServiceRole.entities.Client
          .get(gallery.client_id)
          .catch((e) => (e.status === 404 ? null : Promise.reject(e)))
      : null;
    if (!client) return Response.json({ error: 'Gallery has no client' }, { status: 404 });

    // Only the gallery's own client (or an admin) may trigger this notification.
    const ownsGallery = String(client.email || '').toLowerCase() === String(user.email || '').toLowerCase();
    if (!isAdmin && !ownsGallery) return Response.json({ error: 'Forbidden' }, { status: 403 });
    if (!isValidEmail(client.email)) return Response.json({ error: 'Client has no valid email' }, { status: 400 });

    const selections = await base44.asServiceRole.entities.ImageSelection.filter({
      gallery_id: galleryId,
      client_id: client.id,
    });
    const totalSelected = selections.length;
    const totalFavorites = selections.filter((s) => s.is_favorite).length;
    const totalEdits = selections.filter((s) => s.requested_edit).length;
    const totalFinals = selections.filter((s) => s.final_pick).length;

    const clientName = escapeHtml(client.full_name || client.email);
    const galleryTitle = escapeHtml(gallery.title || 'Your gallery');

    await sendEmail(ADMIN_EMAIL, `New Selections: ${clientName} — ${galleryTitle}`, `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#0a0a0a; color:#e5e5e5; padding:40px; max-width:600px; margin:auto;">
        <h2 style="color:#c9a84c; font-size:18px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;">New Selection Submission</h2>
        <p style="color:#888; font-size:13px; margin-bottom:32px;">${new Date().toLocaleDateString('en-ZA', { dateStyle: 'long' })}</p>
        <table style="width:100%; border-collapse:collapse;">
          <tr><td style="padding:10px 0; border-bottom:1px solid #222; color:#666; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Client</td><td style="padding:10px 0; border-bottom:1px solid #222; color:#e5e5e5; font-size:13px;">${clientName}</td></tr>
          <tr><td style="padding:10px 0; border-bottom:1px solid #222; color:#666; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Gallery</td><td style="padding:10px 0; border-bottom:1px solid #222; color:#e5e5e5; font-size:13px;">${galleryTitle}</td></tr>
          <tr><td style="padding:10px 0; border-bottom:1px solid #222; color:#666; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Total Selected</td><td style="padding:10px 0; border-bottom:1px solid #222; color:#e5e5e5; font-size:13px;">${totalSelected}</td></tr>
          <tr><td style="padding:10px 0; border-bottom:1px solid #222; color:#666; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Favourites</td><td style="padding:10px 0; border-bottom:1px solid #222; color:#e5e5e5; font-size:13px;">${totalFavorites}</td></tr>
          <tr><td style="padding:10px 0; border-bottom:1px solid #222; color:#666; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Edit Requests</td><td style="padding:10px 0; border-bottom:1px solid #222; color:#e5e5e5; font-size:13px;">${totalEdits}</td></tr>
          <tr><td style="padding:10px 0; color:#666; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Final Picks</td><td style="padding:10px 0; color:#e5e5e5; font-size:13px;">${totalFinals}</td></tr>
        </table>
        <p style="margin-top:32px; color:#666; font-size:12px;">Log in to your admin dashboard to review and begin editing.</p>
      </div>
    `);

    await sendEmail(client.email.trim(), `We received your selections — ${galleryTitle}`, `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#0a0a0a; color:#e5e5e5; padding:40px; max-width:600px; margin:auto;">
        <div style="margin-bottom:32px;">
          <span style="font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#c9a84c;">STILLS BY BROOKLYN</span>
          <div style="height:1.5px; background:#c9a84c; margin-top:6px;"></div>
        </div>
        <h2 style="color:#ffffff; font-size:22px; font-weight:700; margin-bottom:8px;">Selections Received</h2>
        <p style="color:#888; font-size:13px; line-height:1.7; margin-bottom:24px;">
          Thank you, ${clientName}. Your selections for <strong style="color:#e5e5e5;">${galleryTitle}</strong> have been received and I'll begin editing shortly.
        </p>
        <div style="background:#111; border:1px solid #222; padding:20px; margin-bottom:24px;">
          <p style="margin:0; color:#666; font-size:11px; text-transform:uppercase; letter-spacing:2px; margin-bottom:12px;">Summary</p>
          <p style="margin:4px 0; color:#e5e5e5; font-size:13px;">${totalSelected} images selected · ${totalFinals} final picks · ${totalEdits} edit requests</p>
        </div>
        <p style="color:#555; font-size:12px;">You'll receive a notification when your final edited gallery is ready.</p>
        <p style="margin-top:32px; color:#555; font-size:12px;">— Brooklyn</p>
      </div>
    `);

    return Response.json({ success: true });
  }

  // Everything else is an admin action.
  if (!isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  if (type === 'gallery_ready') {
    const galleryId = data?.galleryId;
    if (!galleryId) return Response.json({ error: 'galleryId is required' }, { status: 400 });

    const gallery = await base44.asServiceRole.entities.Gallery
      .get(galleryId)
      .catch((e) => (e.status === 404 ? null : Promise.reject(e)));
    if (!gallery) return Response.json({ error: 'Gallery not found' }, { status: 404 });

    const client = gallery.client_id
      ? await base44.asServiceRole.entities.Client
          .get(gallery.client_id)
          .catch((e) => (e.status === 404 ? null : Promise.reject(e)))
      : null;
    if (!client || !isValidEmail(client.email)) {
      return Response.json({ error: 'Gallery has no client email' }, { status: 400 });
    }

    const clientName = escapeHtml(client.full_name || client.email);
    const galleryTitle = escapeHtml(gallery.title || 'Your gallery');

    await sendEmail(client.email.trim(), `Your gallery is ready — ${galleryTitle}`, `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background:#0a0a0a; color:#e5e5e5; padding:40px; max-width:600px; margin:auto;">
        <div style="margin-bottom:32px;">
          <span style="font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#c9a84c;">STILLS BY BROOKLYN</span>
          <div style="height:1.5px; background:#c9a84c; margin-top:6px;"></div>
        </div>
        <h2 style="color:#ffffff; font-size:22px; font-weight:700; margin-bottom:8px;">Your Final Gallery is Ready</h2>
        <p style="color:#888; font-size:13px; line-height:1.7; margin-bottom:24px;">
          Hi ${clientName}, your beautifully edited images for <strong style="color:#e5e5e5;">${galleryTitle}</strong> are now available in your private gallery.
        </p>
        <a href="https://stillsbybrooklyn.co.za/portal/final" style="display:inline-block; background:#c9a84c; color:#000; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; padding:14px 28px; text-decoration:none;">View Final Gallery</a>
        <p style="margin-top:32px; color:#555; font-size:12px;">— Brooklyn</p>
      </div>
    `);
    return Response.json({ success: true });
  }

  if (type === 'client_invited') {
    const clientEmail = String(data?.clientEmail || '').trim();
    if (!isValidEmail(clientEmail)) {
      return Response.json({ error: 'A valid clientEmail is required' }, { status: 400 });
    }

    const clientName = escapeHtml(clip(data?.clientName, 120) || 'there');
    const firstName = escapeHtml((clip(data?.clientName, 120) || 'there').split(' ')[0]);
    const galleryTitleRaw = clip(data?.galleryTitle, 120);
    const galleryTitle = escapeHtml(galleryTitleRaw);
    const galleryHeading = galleryTitleRaw ? `${galleryTitle} is<br>ready for you.` : 'Your gallery is<br>waiting for you.';
    const portalUrl = safeUrl(data?.portalUrl);
    const emailDisplay = escapeHtml(clientEmail);

    await sendEmail(clientEmail, `✨ Your private gallery is ready, ${firstName} — Stills by Brooklyn`, `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#080808; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#080808; padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">

        <!-- Hero image -->
        <tr>
          <td style="padding:0; border-radius:4px 4px 0 0; overflow:hidden; position:relative;">
            <div style="position:relative; overflow:hidden; border-radius:4px 4px 0 0;">
              <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85" alt="Wedding photography" width="600" style="width:100%; display:block; height:280px; object-fit:cover; filter:brightness(0.55);" />
              <!-- Overlay text on image -->
              <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%); display:flex; align-items:flex-end; padding:32px;">
                <div>
                  <p style="margin:0 0 6px; font-size:10px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#c9a84c;">Private Client Portal</p>
                  <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:800; line-height:1.2; letter-spacing:-0.5px;">${galleryHeading}</h1>
                </div>
              </div>
            </div>
          </td>
        </tr>

        <!-- Body card -->
        <tr>
          <td style="background:#0f0f0f; border:1px solid #1c1c1c; border-top:none; padding:40px 40px 32px; border-radius:0 0 4px 4px;">

            <!-- Brand header -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td>
                  <span style="font-size:10px; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:#c9a84c;">STILLS BY BROOKLYN</span>
                  <div style="height:1px; background:linear-gradient(90deg, #c9a84c, transparent); margin-top:8px;"></div>
                </td>
              </tr>
            </table>

            <!-- Greeting -->
            <h2 style="margin:0 0 12px; color:#ffffff; font-size:22px; font-weight:700; line-height:1.3;">Welcome, ${firstName}. 🎉</h2>
            <p style="margin:0 0 28px; color:#888; font-size:14px; line-height:1.85;">
              I'm so excited to share your images with you! Your private gallery is now live and waiting for you to explore. Browse your proof images, mark your favourites, request specific edits, and submit your final picks — all in one beautiful space.
            </p>

            <!-- What to expect bullets -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#141414; border:1px solid #1f1f1f; border-radius:4px; padding:24px; margin-bottom:28px;">
              <tr><td>
                <p style="margin:0 0 16px; color:#555; font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase;">What you can do in your portal</p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr><td style="padding:6px 0;">
                    <span style="color:#c9a84c; font-size:14px; margin-right:10px;">✦</span>
                    <span style="color:#ccc; font-size:13px;">Browse all your proof images in a beautiful gallery</span>
                  </td></tr>
                  <tr><td style="padding:6px 0;">
                    <span style="color:#c9a84c; font-size:14px; margin-right:10px;">✦</span>
                    <span style="color:#ccc; font-size:13px;">Mark favourites, request edits & choose final picks</span>
                  </td></tr>
                  <tr><td style="padding:6px 0;">
                    <span style="color:#c9a84c; font-size:14px; margin-right:10px;">✦</span>
                    <span style="color:#ccc; font-size:13px;">Submit your selections with a single click</span>
                  </td></tr>
                  <tr><td style="padding:6px 0;">
                    <span style="color:#c9a84c; font-size:14px; margin-right:10px;">✦</span>
                    <span style="color:#ccc; font-size:13px;">Download your final edited images when ready</span>
                  </td></tr>
                </table>
              </td></tr>
            </table>

            <!-- Login details box -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a; border:1px solid #c9a84c33; border-left:3px solid #c9a84c; border-radius:0 4px 4px 0; padding:20px 24px; margin-bottom:32px;">
              <tr><td>
                <p style="margin:0 0 4px; color:#666; font-size:10px; font-weight:700; letter-spacing:3px; text-transform:uppercase;">Important — Sign in with this email</p>
                <p style="margin:0 0 10px; color:#c9a84c; font-size:16px; font-weight:600;">${emailDisplay}</p>
                <p style="margin:0; color:#555; font-size:12px; line-height:1.6;">You must sign in using <strong style="color:#888;">${emailDisplay}</strong> — the same address this invitation was sent to. This ensures you are matched to your gallery automatically.</p>
              </td></tr>
            </table>

            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="border-radius:4px; background:linear-gradient(135deg, #d4a843 0%, #c9a84c 50%, #b8952e 100%);">
                  <a href="${portalUrl}" style="display:inline-block; padding:16px 40px; color:#000000; font-size:12px; font-weight:800; letter-spacing:2px; text-transform:uppercase; text-decoration:none; border-radius:4px;">
                    Open My Gallery &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <!-- Fallback link -->
            <p style="margin:0 0 4px; color:#444; font-size:11px;">Can't click? Paste this into your browser:</p>
            <p style="margin:0 0 36px; color:#666; font-size:11px; word-break:break-all;">${portalUrl}</p>

            <!-- Divider -->
            <div style="height:1px; background:#1a1a1a; margin-bottom:28px;"></div>

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="margin:0 0 4px; color:#555; font-size:12px; line-height:1.7;">
                    Can't wait for you to see your images. If you have any questions, just reply to this email or reach out at
                    <a href="mailto:info@stillsbybrooklyn.co.za" style="color:#c9a84c; text-decoration:none;">info@stillsbybrooklyn.co.za</a>
                  </p>
                  <p style="margin:16px 0 0; color:#444; font-size:13px; font-style:italic;">With love, Brooklyn ✨</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Bottom brand strip -->
        <tr>
          <td style="padding:20px 0; text-align:center;">
            <p style="margin:0; color:#333; font-size:10px; letter-spacing:3px; text-transform:uppercase;">STILLS BY BROOKLYN · stillsbybrooklyn.co.za</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>
    `);
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Unknown notification type' }, { status: 400 });
});