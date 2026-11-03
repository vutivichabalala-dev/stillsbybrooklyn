// Shared helpers for keeping user-supplied values out of email markup/headers.

export function escapeHtml(value: unknown): string {
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
export function sanitizeSubject(value: unknown): string {
  return String(value ?? '').replace(/[\r\n]+/g, ' ').slice(0, 180).trim();
}

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  if (email.length < 5 || email.length > 254) return false;
  return /^[^\s@,;:<>()[\]"\\]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email);
}

export function clip(value: unknown, max = 500): string {
  if (value === null || value === undefined) return '';
  return String(value).slice(0, max);
}