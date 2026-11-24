import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js/min';
import * as flags from 'country-flag-icons/string/3x2';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/** the countries the marketers work with come first, and keep their short Arabic names */
const PRIORITY: CountryCode[] = ['EG', 'OM', 'SA', 'PS', 'AE'];
const SHORT_NAMES: Partial<Record<CountryCode, string>> = { EG: 'مصر', OM: 'عمان', SA: 'السعودية', PS: 'فلسطين', AE: 'الإمارات' };

const names = new Intl.DisplayNames(['ar'], { type: 'region' });
const nameOf = (iso: CountryCode): string => SHORT_NAMES[iso] ?? names.of(iso) ?? iso;

export interface PhoneCountry {
  iso: CountryCode;
  name: string;
  /** dial code with the plus sign, e.g. +968 */
  code: string;
}

const ALL: PhoneCountry[] = getCountries()
  .filter((iso) => !!(flags as Record<string, string>)[iso])
  .map((iso) => ({ iso, name: nameOf(iso), code: `+${getCountryCallingCode(iso)}` }));

export const PHONE_COUNTRIES: PhoneCountry[] = [
  ...PRIORITY.map((iso) => ALL.find((c) => c.iso === iso) as PhoneCountry),
  ...ALL.filter((c) => !PRIORITY.includes(c.iso)).sort((a, b) => a.name.localeCompare(b.name, 'ar')),
];

export const countryByIso = (iso: string): PhoneCountry | undefined => PHONE_COUNTRIES.find((c) => c.iso === iso);
export const dialOf = (iso: string): string => countryByIso(iso)?.code ?? '+20';

/** the country a phone number belongs to: from its dial code (first listed country when several share it) */
export function countryOfPhone(phone: string): PhoneCountry | undefined {
  const text = phone.trim();
  const parsed = parsePhoneNumberFromString(text);
  if (parsed?.country) return countryByIso(parsed.country);
  const dial = text.split(/\s+/)[0];
  return PHONE_COUNTRIES.find((c) => c.code === dial);
}

/** the flag as an inline image (bundled, so it shows on every system, unlike flag emoji) */
export function Flag({ iso, className }: { iso: string; className?: string }): JSX.Element | null {
  const svg = (flags as Record<string, string>)[iso];
  if (!svg) return null;
  return <img alt="" className={className ?? 'h-3.5 w-5 shrink-0 rounded-[2px] object-cover'} src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} />;
}

export function PhoneCodeSelect({ value, onChange, disabled }: { value: string; onChange: (iso: string) => void; disabled?: boolean }): JSX.Element {
  const current = countryByIso(value);
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[150px]" aria-label="رمز الدولة">
        <SelectValue>
          <span className="inline-flex items-center gap-2" dir="ltr">
            <Flag iso={value} />
            <span>{current?.code}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {PHONE_COUNTRIES.map((c) => (
          <SelectItem key={c.iso} value={c.iso}>
            <span className="inline-flex items-center gap-2">
              <Flag iso={c.iso} />
              <span>{c.name}</span>
              <span className="text-muted-foreground" dir="ltr">{c.code}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
