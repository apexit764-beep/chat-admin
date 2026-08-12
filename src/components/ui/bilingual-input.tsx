import { useState } from 'react';
import { Input } from './input';

export type BilingualLanguage = 'ar' | 'en';

interface LanguageTabsProps {
  language: BilingualLanguage;
  onChange: (language: BilingualLanguage) => void;
}

/** Shared العربية | En switcher — used by every bilingual field so they look identical. */
export function LanguageTabs({ language, onChange }: LanguageTabsProps): JSX.Element {
  return (
    <div className="flex gap-1 bg-muted p-1 rounded-md">
      <button
        type="button"
        onClick={() => onChange('ar')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'ar'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        العربية
      </button>
      <button
        type="button"
        onClick={() => onChange('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        En
      </button>
    </div>
  );
}

interface BilingualInputProps {
  label: string;
  valueAr: string;
  valueEn: string;
  onChangeAr: (value: string) => void;
  onChangeEn: (value: string) => void;
  required?: boolean;
  type?: 'text' | 'textarea';
  placeholder?: string;
  placeholderAr?: string;
  placeholderEn?: string;
  maxLength?: number;
  error?: string;
}

export function BilingualInput({
  label,
  valueAr,
  valueEn,
  onChangeAr,
  onChangeEn,
  required = false,
  type = 'text',
  placeholder = '',
  placeholderAr,
  placeholderEn,
  maxLength,
  error,
}: BilingualInputProps) {
  const [language, setLanguage] = useState<BilingualLanguage>('ar');

  const currentValue = language === 'ar' ? valueAr : valueEn;
  const currentPlaceholder = (language === 'ar' ? placeholderAr : placeholderEn) ?? placeholder;
  const handleChange = (value: string) => {
    if (language === 'ar') {
      onChangeAr(value);
    } else {
      onChangeEn(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ms-0.5">*</span>}
        </label>
        <LanguageTabs language={language} onChange={setLanguage} />
      </div>

      {type === 'text' ? (
        <Input
          type="text"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          placeholder={currentPlaceholder}
          required={required}
          maxLength={maxLength}
        />
      ) : (
        <textarea
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          placeholder={currentPlaceholder}
          required={required}
          maxLength={maxLength}
          rows={4}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      )}

      {maxLength && <p className="text-[11px] text-muted-foreground">{currentValue.length}/{maxLength}</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
