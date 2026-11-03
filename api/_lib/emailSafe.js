// Shared helpers for keeping user-supplied values out of email markup/headers.

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .slice(0, 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Strip CR/LF so a value can never inject extra mail headers.
export function sanitizeSubject(value) {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').slice(0, 180).trim();
}

export function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  if (email.length < 5 || email.length > 254) return false;
  return /^[^\s@,;:<>()[\]"\\]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email);
}

export function clip(value, max = 500) {
  if (value === null || value === undefined) return '';
  return String(value).slice(0, max);
}