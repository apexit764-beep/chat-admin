import { useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Quote,
  Code,
  Undo2,
  Redo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
  dir?: 'rtl' | 'ltr';
}

interface ToolButtonProps {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

function ToolButton({ onClick, title, children }: ToolButtonProps): JSX.Element {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </button>
  );
}

export function RichEditor({ value, onChange, placeholder, className, minHeight = 240, dir = 'rtl' }: RichEditorProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const exec = (command: string, arg?: string): void => {
    document.execCommand(command, false, arg);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const handleInput = (): void => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const handleLink = (): void => {
    const url = window.prompt('أدخل الرابط:', 'https://');
    if (url) exec('createLink', url);
  };

  return (
    <div className={cn('rounded-xl border overflow-hidden bg-background', className)}>
      <div className="flex items-center gap-0.5 border-b px-2 py-1.5 bg-muted/30 flex-wrap">
        <ToolButton onClick={() => exec('bold')} title="عريض (Ctrl+B)"><Bold className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('italic')} title="مائل (Ctrl+I)"><Italic className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('underline')} title="مسطّر (Ctrl+U)"><Underline className="h-3.5 w-3.5" /></ToolButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolButton onClick={() => exec('formatBlock', '<h2>')} title="عنوان كبير"><Heading1 className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('formatBlock', '<h3>')} title="عنوان فرعي"><Heading2 className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('formatBlock', '<blockquote>')} title="اقتباس"><Quote className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('formatBlock', '<pre>')} title="كود"><Code className="h-3.5 w-3.5" /></ToolButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolButton onClick={() => exec('insertUnorderedList')} title="قائمة نقطية"><List className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('insertOrderedList')} title="قائمة مرقمة"><ListOrdered className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={handleLink} title="رابط"><Link2 className="h-3.5 w-3.5" /></ToolButton>
        <div className="w-px h-5 bg-border mx-1" />
        <ToolButton onClick={() => exec('undo')} title="تراجع"><Undo2 className="h-3.5 w-3.5" /></ToolButton>
        <ToolButton onClick={() => exec('redo')} title="إعادة"><Redo2 className="h-3.5 w-3.5" /></ToolButton>
      </div>
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        dir={dir}
        className="px-4 py-3 outline-none prose-sm max-w-none rich-editor-content"
        style={{ minHeight }}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
      <style>{`
        .rich-editor-content:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        .rich-editor-content h2 { font-size: 1.25rem; font-weight: 700; margin: 0.75rem 0 0.5rem; }
        .rich-editor-content h3 { font-size: 1.05rem; font-weight: 600; margin: 0.6rem 0 0.35rem; }
        .rich-editor-content p { margin: 0.35rem 0; }
        .rich-editor-content ul, .rich-editor-content ol { padding-inline-start: 1.5rem; margin: 0.5rem 0; }
        .rich-editor-content ul { list-style: disc; }
        .rich-editor-content ol { list-style: decimal; }
        .rich-editor-content blockquote { border-inline-start: 3px solid hsl(var(--primary) / 0.4); padding-inline-start: 0.75rem; color: hsl(var(--muted-foreground)); margin: 0.5rem 0; }
        .rich-editor-content pre { background: hsl(var(--muted)); padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-family: ui-monospace, monospace; font-size: 0.85rem; overflow-x: auto; margin: 0.5rem 0; }
        .rich-editor-content a { color: hsl(var(--primary)); text-decoration: underline; }
      `}</style>
    </div>
  );
}
