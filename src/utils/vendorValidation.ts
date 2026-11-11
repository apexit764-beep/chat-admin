/** Field rules for the vendor pages of the admin. The same wording is shown under each field. */
export const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const lengthBetween = (v: string, min: number, max: number): boolean => v.trim().length >= min && v.trim().length <= max;
/** starts with an optional +, then digits and spaces */
export const isIntlPhone = (v: string): boolean => /^\+?[\d\s]{8,20}$/.test(v.trim()) && v.replace(/\D/g, '').length >= 8;
export const isTransferRef = (v: string): boolean => /^[A-Za-z0-9-]{4,40}$/.test(v.trim());
export const MAX_RECEIPT_MB = 5;
