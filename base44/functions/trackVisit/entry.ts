import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const body = await req.json().catch(() => ({}));
  const { page, referrer, screen_width } = body;

  const headers = req.headers;
  const userAgent = headers.get('user-agent') || '';
  const ip = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || headers.get('x-real-ip') || 'unknown';
  const acceptLanguage = headers.get('accept-language') || '';
  const language = acceptLanguage.split(',')[0] || 'unknown';

  // Detect device type
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  const isTablet = /ipad|tablet/i.test(userAgent);
  const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

  // Detect browser
  let browser = 'Other';
  if (/chrome/i.test(userAgent) && !/edge|opr/i.test(userAgent)) browser = 'Chrome';
  else if (/firefox/i.test(userAgent)) browser = 'Firefox';
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari';
  else if (/edge/i.test(userAgent)) browser = 'Edge';

  // Detect OS
  let os = 'Other';
  if (/windows/i.test(userAgent)) os = 'Windows';
  else if (/mac os/i.test(userAgent)) os = 'macOS';
  else if (/android/i.test(userAgent)) os = 'Android';
  else if (/iphone|ipad/i.test(userAgent)) os = 'iOS';
  else if (/linux/i.test(userAgent)) os = 'Linux';

  // Geo lookup via free IP API
  let country = 'Unknown';
  let city = 'Unknown';
  try {
    if (ip && ip !== 'unknown' && ip !== '127.0.0.1') {
      const geo = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`);
      if (geo.ok) {
        const geoData = await geo.json();
        country = geoData.country || 'Unknown';
        city = geoData.city || 'Unknown';
      }
    }
  } catch (_) { /* geo lookup optional */ }

  await base44.asServiceRole.entities.PageVisit.create({
    page: page || '/',
    referrer: referrer || 'direct',
    device,
    browser,
    os,
    language,
    country,
    city,
    screen_width: screen_width || 0,
    visited_at: new Date().toISOString(),
  });

  return Response.json({ ok: true });
});