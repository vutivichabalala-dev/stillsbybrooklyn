import { escapeHtml } from './emailSafe.js';

// Brand + links used in every email (images are served from the live site)
const SITE = 'https://www.stillsbybrooklyn.co.za';
const LOGO_GIF = `${SITE}/email/sb-logo.gif`;
const HERO = `${SITE}/email/hero-strip.jpg`;
const WHATSAPP_NUMBER = '27663492811';
const WHATSAPP_DISPLAY = '066 349 2811';
const INSTAGRAM = 'https://www.instagram.com/stillsbybrooklyn/';

const C = {
  ink: '#141213', card: '#1C191A', line: '#332E30', ivory: '#F6F3EE',
  muted: '#B9B2AA', soft: '#8E8780', orange: '#EB7F3B', burnt: '#9E4317',
};
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS = "Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif";

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function shortDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
}
function formatTime(t) {
  if (!t || typeof t !== 'string' || !t.includes(':')) return '';
  const [h, m] = t.split(':');
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return '';
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}
// South African numbers → international digits for wa.me / tel: links
function intlPhone(raw) {
  let digits = String(raw || '').replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `27${digits.slice(1)}`;
  return digits.length >= 9 ? digits : '';
}
// 'Weddings' → 'wedding session'
const sessionWord = (service) => String(service || '').toLowerCase().replace(/s$/, '');
const firstName = (name) => String(name || '').trim().split(/\s+/)[0] || 'there';

/* ------------------------------------------------------------------ */
/* Shared building blocks (table-based so they render in every inbox)  */
/* ------------------------------------------------------------------ */

function shell({ title, preheader, body }) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${title}</title>
<style>
  body { margin:0; padding:0; background:${C.ink}; }
  a { color:${C.orange}; }
  @media (max-width: 620px) {
    .px { padding-left:24px !important; padding-right:24px !important; }
    .h1 { font-size:36px !important; line-height:40px !important; }
    .stack { display:block !important; width:100% !important; }
    .btn a { display:block !important; }
  }
  /* Gentle fade-in where the inbox supports CSS animation (Apple Mail, iOS) */
  @keyframes sbRise { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
  .rise { animation: sbRise .9s ease-out both; }
  .rise2 { animation: sbRise .9s .25s ease-out both; }
  .rise3 { animation: sbRise .9s .5s ease-out both; }
</style>
</head>
<body style="margin:0;padding:0;background:${C.ink};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.ink};">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.ink};">
  <tr><td align="center" style="padding:28px 12px 40px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:${C.ink};">
      ${body}
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function logoRow() {
  return `<tr><td align="center" style="padding:8px 0 22px;">
    <a href="${SITE}" style="text-decoration:none;"><img src="${LOGO_GIF}" width="240" height="99" alt="sb. Stills by Brooklyn" style="display:block;width:240px;height:auto;border:0;outline:none;color:${C.ivory};font-family:${SANS};font-size:22px;"></a>
  </td></tr>`;
}

function button(href, label, primary = true) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" class="btn" style="display:inline-table;margin:6px 6px;">
    <tr><td align="center" style="${primary ? `background:${C.orange};` : `border:1px solid ${C.muted};`}">
      <a href="${href}" target="_blank" style="display:inline-block;padding:15px 26px;font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;text-decoration:none;color:${primary ? C.ink : C.ivory};">${label}</a>
    </td></tr>
  </table>`;
}

function rows(pairs) {
  return pairs
    .filter(([, v]) => v)
    .map(([label, value], i, arr) => `
      <tr>
        <td style="padding:13px 0;${i < arr.length - 1 ? `border-bottom:1px solid ${C.line};` : ''}font-family:${SANS};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${C.soft};width:38%;vertical-align:top;">${label}</td>
        <td style="padding:13px 0;${i < arr.length - 1 ? `border-bottom:1px solid ${C.line};` : ''}font-family:${SANS};font-size:15px;line-height:22px;color:${C.ivory};vertical-align:top;">${value}</td>
      </tr>`)
    .join('');
}

function footer() {
  return `
  <tr><td style="padding:34px 0 0;"><div style="height:1px;background:${C.line};line-height:1px;font-size:0;">&nbsp;</div></td></tr>
  <tr><td align="center" style="padding:26px 24px 6px;font-family:${SANS};font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${C.muted};">
    People &nbsp;·&nbsp; Moments &nbsp;·&nbsp; Culture &nbsp;·&nbsp; Events
  </td></tr>
  <tr><td align="center" style="padding:10px 24px;font-family:${SANS};font-size:13px;line-height:22px;color:${C.soft};">
    <a href="https://wa.me/${WHATSAPP_NUMBER}" style="color:${C.ivory};text-decoration:none;">WhatsApp ${WHATSAPP_DISPLAY}</a>
    &nbsp;<span style="color:${C.orange};">·</span>&nbsp;
    <a href="${INSTAGRAM}" style="color:${C.ivory};text-decoration:none;">@stillsbybrooklyn</a>
    &nbsp;<span style="color:${C.orange};">·</span>&nbsp;
    <a href="${SITE}" style="color:${C.ivory};text-decoration:none;">stillsbybrooklyn.co.za</a>
  </td></tr>
  <tr><td align="center" style="padding:4px 24px 0;font-family:${SANS};font-size:11px;letter-spacing:1px;color:${C.soft};">Midrand, Gauteng &nbsp;·&nbsp; Available nationwide</td></tr>`;
}

/* ------------------------------------------------------------------ */
/* Email to the client                                                 */
/* ------------------------------------------------------------------ */

export function clientConfirmationEmail({ name, type, data }) {
  const isBooking = type === 'booking';
  const fname = escapeHtml(firstName(name));
  const service = escapeHtml(data.service || '');
  const waText = encodeURIComponent(isBooking
    ? `Hi Brooklyn, it's ${firstName(name)} — I've just requested a ${data.service || ''} session for ${formatDate(data.date)}.`
    : `Hi Brooklyn, it's ${firstName(name)} — I sent you a message through your website.`);

  const summary = isBooking
    ? rows([
        ['Session', service],
        ['Date', escapeHtml(formatDate(data.date))],
        ['Time', escapeHtml(formatTime(data.time))],
        ['Venue', escapeHtml(data.venue_name)],
        ['Location', escapeHtml(data.location_address)],
      ])
    : rows([
        ['Interested in', service],
        ['Your message', escapeHtml(String(data.message || '').slice(0, 280)) + (String(data.message || '').length > 280 ? '…' : '')],
      ]);

  const steps = isBooking
    ? [
        ['01', 'I confirm your date', 'I personally check my calendar and confirm your date and time within 24–48 hours.'],
        ['02', 'We plan it together', 'Location, outfits, light and the shots that matter most to you — so the day feels easy.'],
        ['03', 'Your images arrive', 'Carefully edited, high-resolution photographs, delivered in your own private online gallery.'],
      ]
    : [
        ['01', 'I read every message', 'Your note comes straight to me — not a team, not a bot.'],
        ['02', 'I reply within 24–48 hours', 'With answers, ideas and available dates for your shoot.'],
        ['03', 'We make something beautiful', 'Once we have a plan, you can book your session in a few clicks.'],
      ];

  const body = `
  ${logoRow()}
  <tr><td style="padding:0;">
    <a href="${SITE}/portfolio" style="text-decoration:none;"><img src="${HERO}" width="600" alt="Portraits by Stills by Brooklyn" style="display:block;width:100%;max-width:600px;height:auto;border:0;"></a>
  </td></tr>
  <tr><td class="px" style="padding:44px 48px 8px;">
    <div class="rise" style="font-family:${SANS};font-size:12px;letter-spacing:4px;text-transform:uppercase;color:${C.orange};">${isBooking ? 'Booking request received' : 'Message received'}</div>
    <div style="height:2px;width:48px;background:${C.orange};margin:16px 0 22px;line-height:2px;font-size:0;">&nbsp;</div>
    <h1 class="h1 rise2" style="margin:0;font-family:${SERIF};font-weight:500;font-size:44px;line-height:48px;color:${C.ivory};">
      ${isBooking ? `Thank you, ${fname}.<br><span style="font-style:italic;color:${C.orange};">Your moment is pencilled in.</span>` : `Thank you, ${fname}.<br><span style="font-style:italic;color:${C.orange};">Your message is with me.</span>`}
    </h1>
    <p class="rise3" style="margin:24px 0 0;font-family:${SANS};font-size:16px;line-height:27px;color:${C.muted};">
      ${isBooking
        ? `I'm so glad you chose Stills by Brooklyn for your ${service ? `<strong style="color:${C.ivory};font-weight:700;">${sessionWord(service)}</strong> ` : ''}session. Your request has landed safely with me, and I'll personally confirm everything within <strong style="color:${C.ivory};">24–48 hours</strong>.`
        : `Thank you for reaching out — it means a lot. I've received your message and I'll get back to you personally within <strong style="color:${C.ivory};">24–48 hours</strong>.`}
    </p>
  </td></tr>

  <tr><td class="px" style="padding:30px 48px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.card};border-left:3px solid ${C.orange};">
      <tr><td style="padding:22px 26px 10px;font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.orange};">${isBooking ? 'Your booking' : 'Your enquiry'}</td></tr>
      <tr><td style="padding:0 26px 14px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${summary}</table></td></tr>
    </table>
  </td></tr>

  <tr><td class="px" style="padding:40px 48px 0;">
    <div style="font-family:${SERIF};font-size:28px;line-height:32px;color:${C.ivory};">What happens next</div>
  </td></tr>
  ${steps.map(([n, t, d]) => `
  <tr><td class="px" style="padding:18px 48px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="56" style="vertical-align:top;font-family:${SERIF};font-size:30px;line-height:30px;color:${C.orange};">${n}</td>
      <td style="vertical-align:top;border-top:1px solid ${C.line};padding-top:12px;">
        <div style="font-family:${SANS};font-size:12px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${C.ivory};">${t}</div>
        <div style="margin-top:6px;font-family:${SANS};font-size:14px;line-height:22px;color:${C.muted};">${d}</div>
      </td>
    </tr></table>
  </td></tr>`).join('')}

  <tr><td align="center" class="px" style="padding:40px 40px 4px;">
    ${button(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, 'WhatsApp Brooklyn', true)}
    ${button(`${SITE}/portfolio`, 'See the portfolio', false)}
  </td></tr>

  <tr><td class="px" style="padding:36px 48px 0;">
    <p style="margin:0;font-family:${SANS};font-size:15px;line-height:25px;color:${C.muted};">Can't wait to create with you.</p>
    <p style="margin:6px 0 0;font-family:${SERIF};font-style:italic;font-size:30px;line-height:34px;color:${C.ivory};">Brooklyn<span style="color:${C.orange};font-style:normal;">.</span></p>
  </td></tr>
  ${footer()}`;

  return shell({
    title: isBooking ? 'Your booking request — Stills by Brooklyn' : 'Message received — Stills by Brooklyn',
    preheader: isBooking ? `Thank you, ${firstName(name)} — I'll confirm your ${data.service || ''} session within 24–48 hours.` : `Thank you, ${firstName(name)} — I'll reply personally within 24–48 hours.`,
    body,
  });
}

/* ------------------------------------------------------------------ */
/* Notification to Brooklyn                                            */
/* ------------------------------------------------------------------ */

export function adminNotificationEmail({ type, data }) {
  const isBooking = type === 'booking';
  const name = isBooking ? data.full_name : data.name;
  const safeName = escapeHtml(name);
  const service = escapeHtml(data.service || '');
  const email = String(data.email || '').trim();
  const phone = intlPhone(data.phone);
  const subjectLine = encodeURIComponent(isBooking ? `Your ${data.service || ''} session with Stills by Brooklyn` : 'Re: your enquiry — Stills by Brooklyn');
  const waText = encodeURIComponent(`Hi ${firstName(name)}, it's Brooklyn from Stills by Brooklyn — thank you for your ${isBooking ? 'booking request' : 'message'}!`);
  const received = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  const details = isBooking
    ? rows([
        ['Client', safeName],
        ['Email', `<a href="mailto:${escapeHtml(email)}" style="color:${C.ivory};">${escapeHtml(email)}</a>`],
        ['Phone', escapeHtml(data.phone)],
        ['Session', service],
        ['Date', escapeHtml(formatDate(data.date))],
        ['Time', escapeHtml(formatTime(data.time))],
        ['Venue', escapeHtml(data.venue_name)],
        ['Location', escapeHtml(data.location_address)],
      ])
    : rows([
        ['Name', safeName],
        ['Email', `<a href="mailto:${escapeHtml(email)}" style="color:${C.ivory};">${escapeHtml(email)}</a>`],
        ['Phone', escapeHtml(data.phone)],
        ['Interested in', service],
      ]);

  const note = isBooking ? data.notes : data.message;

  const body = `
  <tr><td style="padding:0 0 18px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="vertical-align:middle;"><img src="${LOGO_GIF}" width="150" height="62" alt="sb." style="display:block;width:150px;height:auto;border:0;"></td>
      <td align="right" style="vertical-align:middle;">
        <span style="display:inline-block;background:${C.orange};color:${C.ink};font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;padding:8px 14px;">${isBooking ? 'New booking' : 'New enquiry'}</span>
      </td>
    </tr></table>
  </td></tr>

  <tr><td style="background:${C.burnt};padding:36px 36px 34px;" class="px">
    <div style="font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#F8D9C3;">${escapeHtml(received)}</div>
    <h1 class="h1" style="margin:12px 0 0;font-family:${SERIF};font-weight:500;font-size:40px;line-height:44px;color:${C.ivory};">
      ${isBooking
        ? `${safeName} would love a <span style="font-style:italic;">${sessionWord(service)}</span> session.`
        : `${safeName} sent you a message${service ? ` about <span style="font-style:italic;">${service.toLowerCase()}</span>` : ''}.`}
    </h1>
    ${isBooking ? `<div style="margin-top:18px;font-family:${SANS};font-size:16px;line-height:24px;color:${C.ivory};"><strong>${escapeHtml(formatDate(data.date))}</strong> &nbsp;·&nbsp; ${escapeHtml(formatTime(data.time))}</div>` : ''}
  </td></tr>

  <tr><td align="center" style="padding:26px 10px 6px;">
    ${email ? button(`mailto:${encodeURIComponent(email)}?subject=${subjectLine}`, 'Reply by email', true) : ''}
    ${phone ? button(`https://wa.me/${phone}?text=${waText}`, 'WhatsApp', false) : ''}
    ${phone ? button(`tel:+${phone}`, 'Call', false) : ''}
  </td></tr>

  <tr><td style="padding:22px 0 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.card};">
      <tr><td style="padding:22px 26px 6px;font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.orange};">Details</td></tr>
      <tr><td style="padding:0 26px 16px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${details}</table></td></tr>
    </table>
  </td></tr>

  ${note ? `
  <tr><td style="padding:22px 0 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:3px solid ${C.orange};">
      <tr><td style="padding:6px 0 6px 22px;">
        <div style="font-family:${SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.soft};">${isBooking ? 'Notes from the client' : 'Their message'}</div>
        <div style="margin-top:10px;font-family:${SERIF};font-style:italic;font-size:21px;line-height:30px;color:${C.ivory};white-space:pre-line;">“${escapeHtml(note)}”</div>
      </td></tr>
    </table>
  </td></tr>` : ''}

  <tr><td style="padding:30px 0 0;font-family:${SANS};font-size:12px;line-height:20px;color:${C.soft};">
    Tip: replying within a few hours makes a big difference — the client has already received a branded confirmation from you.
  </td></tr>
  ${footer()}`;

  return shell({
    title: isBooking ? 'New booking — Stills by Brooklyn' : 'New enquiry — Stills by Brooklyn',
    preheader: isBooking ? `${name} · ${data.service || ''} · ${shortDate(data.date)} ${formatTime(data.time)}` : `${name}: ${String(data.message || '').slice(0, 90)}`,
    body,
  });
}


/* ------------------------------------------------------------------ */
/* Plain-text alternatives (multipart emails score far better)        */
/* ------------------------------------------------------------------ */

const line = (label, value) => (value ? `${label}: ${value}` : null);

export function clientConfirmationText({ name, type, data }) {
  const isBooking = type === 'booking';
  const fname = firstName(name);
  const details = isBooking
    ? [line('Session', data.service), line('Date', formatDate(data.date)), line('Time', formatTime(data.time)), line('Venue', data.venue_name), line('Location', data.location_address), line('Your notes', data.notes)]
    : [line('Interested in', data.service), line('Your message', data.message)];
  return [
    `Hi ${fname},`,
    '',
    isBooking
      ? `Thank you for choosing Stills by Brooklyn for your ${data.service ? sessionWord(data.service) + ' ' : ''}session. Your booking request has reached me and I'll personally confirm your date and time within 24-48 hours.`
      : `Thank you for reaching out. I've received your message and I'll reply personally within 24-48 hours.`,
    '',
    isBooking ? 'YOUR BOOKING' : 'YOUR ENQUIRY',
    ...details.filter(Boolean),
    '',
    'WHAT HAPPENS NEXT',
    ...(isBooking
      ? ['1. I confirm your date and time.', '2. We plan the shoot together: location, outfits, light and the shots that matter most.', '3. Your edited, high-resolution images arrive in your own private online gallery.']
      : ['1. I read every message myself.', '2. I reply within 24-48 hours with answers, ideas and available dates.', '3. Once we have a plan, you can book your session in a few clicks.']),
    '',
    `WhatsApp: ${WHATSAPP_DISPLAY} (https://wa.me/${WHATSAPP_NUMBER})`,
    `Portfolio: ${SITE}/portfolio`,
    `Instagram: ${INSTAGRAM}`,
    '',
    "Can't wait to create with you.",
    'Brooklyn',
    'Stills by Brooklyn, Johannesburg',
    '',
    'You are receiving this because you submitted a form on stillsbybrooklyn.co.za.',
  ].join('\n');
}

export function adminNotificationText({ type, data }) {
  const isBooking = type === 'booking';
  const name = isBooking ? data.full_name : data.name;
  const phone = intlPhone(data.phone);
  const details = isBooking
    ? [line('Client', name), line('Email', data.email), line('Phone', data.phone), line('Session', data.service), line('Date', formatDate(data.date)), line('Time', formatTime(data.time)), line('Venue', data.venue_name), line('Location', data.location_address)]
    : [line('Name', name), line('Email', data.email), line('Phone', data.phone), line('Interested in', data.service)];
  const note = isBooking ? data.notes : data.message;
  return [
    isBooking ? `NEW BOOKING REQUEST from ${name}` : `NEW ENQUIRY from ${name}`,
    '',
    ...details.filter(Boolean),
    ...(note ? ['', isBooking ? 'NOTES FROM THE CLIENT' : 'THEIR MESSAGE', note] : []),
    '',
    `Reply: ${data.email}`,
    ...(phone ? [`WhatsApp: https://wa.me/${phone}`] : []),
    '',
    'Sent by the booking form on stillsbybrooklyn.co.za.',
  ].join('\n');
}

export { shortDate, formatTime };
