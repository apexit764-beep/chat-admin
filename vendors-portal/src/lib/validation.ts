/** Field rules shared by the vendor portal forms. The same wording is shown under each field. */

export const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** English letters, digits and symbols only: no Arabic letters, no spaces */
export const PASSWORD_CHARSET = /^[\x21-\x7E]+$/;

export const passwordRules = (p: string): { ok: boolean; label: string }[] => [
  { ok: p.length >= 8, label: '8 أحرف أو أكثر' },
  { ok: /[A-Za-z]/.test(p), label: 'حرف إنجليزي واحد على الأقل' },
  { ok: /\d/.test(p), label: 'رقم واحد على الأقل' },
  { ok: p.length === 0 || PASSWORD_CHARSET.test(p), label: 'حروف إنجليزية وأرقام ورموز فقط، بدون حروف عربية أو مسافات' },
];

export const lengthBetween = (v: string, min: number, max: number): boolean => v.trim().length >= min && v.trim().length <= max;
export const isPhoneDigits = (v: string): boolean => /^\d{6,15}$/.test(v.trim());
export const isAccountNumber = (v: string): boolean => /^[A-Za-z0-9]{8,34}$/.test(v.replace(/\s/g, ''));
export const isHolderName = (v: string): boolean => /^[\p{L}\s.'-]{3,80}$/u.test(v.trim());
export const isWalletNumber = (v: string): boolean => /^\d{8,15}$/.test(v.trim());
export const decimalsAtMost3 = (n: number): boolean => Math.round(n * 1000) / 1000 === n;
