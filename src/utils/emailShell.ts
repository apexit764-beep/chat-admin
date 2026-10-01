import type { EmailButton } from '@/store/useSettingsStore';

/**
 * The branded shell every outgoing mail is wrapped in.
 *
 * Mail clients are not browsers: Outlook renders with Word's engine, Gmail
 * strips <style> blocks and external CSS, and flexbox/grid are unsupported in
 * both. So this is deliberately old-fashioned — nested tables, inline styles,
 * fixed widths, and buttons built from a table cell rather than an <a> with
 * padding. It is not how the rest of the app is written, and should not be.
 */

export interface EmailShellInput {
  subject: string;
  /** the template body, already HTML */
  bodyHtml: string;
  buttons?: EmailButton[];
  company: {
    name: string;
    address?: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  /** absolute URL — mail clients cannot resolve a relative path */
  logoUrl?: string;
  social?: Partial<Record<'facebook' | 'twitter' | 'instagram' | 'linkedin', string>>;
  year?: number;
}

const BRAND = '#1F5AE0';
const INK = '#0F172A';
const MUTED = '#64748B';
const LINE = '#E2E8F0';
const CANVAS = '#F1F5F9';
const FONT = "'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, Arial, sans-serif";

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A button that survives Outlook: a table cell with a background, not a padded <a>. */
function renderButton(btn: EmailButton): string {
  const label = esc(btn.text || 'زر');
  const href = esc(btn.url || '#');

  if (btn.variant === 'link') {
    return `<a href="${href}" style="color:${BRAND};font-family:${FONT};font-size:15px;font-weight:600;text-decoration:underline;">${label}</a>`;
  }
  const outline = btn.variant === 'outline';
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
    <tr><td align="center" bgcolor="${outline ? '#FFFFFF' : BRAND}" style="border-radius:8px;border:1px solid ${BRAND};">
      <a href="${href}" style="display:inline-block;padding:13px 32px;font-family:${FONT};font-size:15px;font-weight:700;line-height:1;color:${outline ? BRAND : '#FFFFFF'};text-decoration:none;border-radius:8px;">${label}</a>
    </td></tr>
  </table>`;
}

/**
 * Strips the editor's classes and forces type styles onto the body HTML.
 * Gmail drops <style> blocks, so every rule has to ride on the element.
 */
function styleBody(html: string): string {
  return html
    .replace(/ class="[^"]*"/g, '')
    .replace(/<p>/g, `<p style="margin:0 0 16px;font-family:${FONT};font-size:15px;line-height:1.9;color:${INK};">`)
    .replace(/<h2>/g, `<h2 style="margin:0 0 12px;font-family:${FONT};font-size:19px;line-height:1.5;color:${INK};font-weight:700;">`)
    .replace(/<(ul|ol)>/g, `<$1 style="margin:0 0 16px;padding-inline-start:22px;font-family:${FONT};font-size:15px;line-height:1.9;color:${INK};">`)
    .replace(/<li>/g, '<li style="margin:0 0 6px;">')
    .replace(/<a /g, `<a style="color:${BRAND};text-decoration:underline;" `);
}

export function renderEmail(input: EmailShellInput): string {
  const { subject, bodyHtml, buttons = [], company, logoUrl, social = {} } = input;
  const year = input.year ?? new Date().getFullYear();
  const name = esc(company.name || 'Qhub');

  const header = logoUrl
    ? `<img src="${esc(logoUrl)}" width="52" height="52" alt="${name}" style="display:block;margin:0 auto 10px;border:0;" />`
    : '';

  const buttonsRow = buttons.length
    ? `<tr><td align="center" style="padding:8px 32px 28px;">
         ${buttons.map((b) => `<div style="display:inline-block;margin:0 6px 10px;">${renderButton(b)}</div>`).join('')}
       </td></tr>`
    : '';

  const contact = [
    company.email ? `<a href="mailto:${esc(company.email)}" style="color:${MUTED};text-decoration:none;">${esc(company.email)}</a>` : '',
    company.phone ? esc(company.phone) : '',
    company.website ? `<a href="${esc(company.website)}" style="color:${MUTED};text-decoration:none;">${esc(company.website)}</a>` : '',
  ].filter(Boolean).join(' &nbsp;·&nbsp; ');

  const links = Object.entries(social).filter(([, v]) => v)
    .map(([k, v]) => `<a href="${esc(v as string)}" style="color:${MUTED};text-decoration:none;font-size:12px;">${k}</a>`)
    .join(' &nbsp;·&nbsp; ');

  return `<!doctype html>
<html lang="ar" dir="rtl"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${CANVAS};">
<!-- the line shown next to the subject in the inbox, never on the page itself -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(subject)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CANVAS};padding:28px 12px;">
<tr><td align="center">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#FFFFFF;border:1px solid ${LINE};border-radius:14px;overflow:hidden;">

    <tr><td align="center" style="padding:28px 32px 20px;border-bottom:1px solid ${LINE};">
      ${header}
      <div style="font-family:${FONT};font-size:17px;font-weight:700;color:${INK};letter-spacing:-0.2px;">${name}</div>
    </td></tr>

    <tr><td style="padding:28px 32px 4px;" dir="rtl">
      ${styleBody(bodyHtml || `<p style="color:${MUTED};">لا يوجد محتوى</p>`)}
    </td></tr>

    ${buttonsRow}

    <tr><td style="padding:0 32px 28px;">
      <div style="height:1px;background:${LINE};font-size:0;line-height:0;">&nbsp;</div>
    </td></tr>

    <tr><td align="center" style="padding:0 32px 28px;">
      ${company.address ? `<div style="font-family:${FONT};font-size:12px;line-height:1.7;color:${MUTED};margin-bottom:4px;">${esc(company.address)}</div>` : ''}
      ${contact ? `<div style="font-family:${FONT};font-size:12px;line-height:1.7;color:${MUTED};margin-bottom:6px;">${contact}</div>` : ''}
      ${links ? `<div style="font-family:${FONT};line-height:1.7;margin-bottom:6px;">${links}</div>` : ''}
      <div style="font-family:${FONT};font-size:11px;color:${MUTED};">&copy; ${year} ${name}. جميع الحقوق محفوظة.</div>
    </td></tr>

  </table>

</td></tr>
</table>
</body></html>`;
}
