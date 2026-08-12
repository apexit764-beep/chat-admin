import { useState } from 'react';
import { LanguageTabs, type BilingualLanguage } from './bilingual-input';
import { RichEditor } from './rich-editor';

interface BilingualRichEditorProps {
  label: string;
  valueAr: string;
  valueEn: string;
  onChangeAr: (html: string) => void;
  onChangeEn: (html: string) => void;
  required?: boolean;
  placeholderAr?: string;
  placeholderEn?: string;
  minHeight?: number;
  error?: string;
}

export function BilingualRichEditor({
  label,
  valueAr,
  valueEn,
  onChangeAr,
  onChangeEn,
  required = false,
  placeholderAr = '',
  placeholderEn = '',
  minHeight = 280,
  error,
}: BilingualRichEditorProps): JSX.Element {
  const [language, setLanguage] = useState<BilingualLanguage>('ar');

  const isAr = language === 'ar';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ms-0.5">*</span>}
        </label>
        <LanguageTabs language={language} onChange={setLanguage} />
      </div>

      {/* keyed by language so each version keeps its own editing/undo state */}
      <RichEditor
        key={language}
        value={isAr ? valueAr : valueEn}
        onChange={isAr ? onChangeAr : onChangeEn}
        placeholder={isAr ? placeholderAr : placeholderEn}
        dir={isAr ? 'rtl' : 'ltr'}
        minHeight={minHeight}
      />

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
