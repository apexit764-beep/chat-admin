import { useState } from 'react';
import { Input } from './input';

interface BilingualInputProps {
  label: string;
  valueAr: string;
  valueEn: string;
  onChangeAr: (value: string) => void;
  onChangeEn: (value: string) => void;
  required?: boolean;
  type?: 'text' | 'textarea';
  placeholder?: string;
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
  error,
}: BilingualInputProps) {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const currentValue = language === 'ar' ? valueAr : valueEn;
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
        <div className="flex gap-1 bg-muted p-1 rounded-md">
          <button
            type="button"
            onClick={() => setLanguage('ar')}
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
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              language === 'en'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            En
          </button>
        </div>
      </div>

      {type === 'text' ? (
        <Input
          type="text"
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <textarea
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          placeholder={placeholder}
          required={required}
          rows={4}
          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
