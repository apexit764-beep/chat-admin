import { useState } from 'react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subWeeks, subMonths } from 'date-fns';
import { ar } from 'date-fns/locale';
import { CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangeValue {
  from: Date;
  to: Date;
}

interface Preset {
  label: string;
  getValue: () => DateRangeValue;
}

const presets: Preset[] = [
  {
    label: 'اليوم',
    getValue: () => ({ from: new Date(), to: new Date() }),
  },
  {
    label: 'أمس',
    getValue: () => {
      const d = subDays(new Date(), 1);
      return { from: d, to: d };
    },
  },
  {
    label: 'آخر 7 أيام',
    getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    label: 'آخر 14 يوم',
    getValue: () => ({ from: subDays(new Date(), 13), to: new Date() }),
  },
  {
    label: 'آخر 30 يوم',
    getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }),
  },
  {
    label: 'هذا الأسبوع',
    getValue: () => ({ from: startOfWeek(new Date(), { weekStartsOn: 6 }), to: endOfWeek(new Date(), { weekStartsOn: 6 }) }),
  },
  {
    label: 'الأسبوع الماضي',
    getValue: () => {
      const last = subWeeks(new Date(), 1);
      return { from: startOfWeek(last, { weekStartsOn: 6 }), to: endOfWeek(last, { weekStartsOn: 6 }) };
    },
  },
  {
    label: 'هذا الشهر',
    getValue: () => ({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) }),
  },
  {
    label: 'الشهر الماضي',
    getValue: () => {
      const last = subMonths(new Date(), 1);
      return { from: startOfMonth(last), to: endOfMonth(last) };
    },
  },
];

interface DateRangePickerProps {
  value: DateRangeValue | undefined;
  onChange: (range: DateRangeValue | undefined) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('آخر 7 أيام');

  const handlePreset = (preset: Preset) => {
    setActivePreset(preset.label);
    onChange(preset.getValue());
  };

  const formatRange = (range: DateRangeValue | undefined): string => {
    if (!range?.from) return 'اختر فترة';
    if (!range.to) return format(range.from, 'd MMMM yyyy', { locale: ar });
    return `${format(range.from, 'd MMMM', { locale: ar })} — ${format(range.to, 'd MMMM yyyy', { locale: ar })}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'justify-start text-start font-normal h-10 gap-2 min-w-[260px]',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          {formatRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex" dir="rtl">
          {/* Presets sidebar */}
          <div className="border-e px-1 py-1.5 space-y-px min-w-[75px]">
            <p className="text-[8px] font-semibold text-muted-foreground mb-1 px-1">اختيارات سريعة</p>
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePreset(preset)}
                className={cn(
                  'w-full text-start text-[10px] leading-tight px-1 py-0.5 rounded transition-colors',
                  activePreset === preset.label
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                {activePreset === preset.label && <span className="me-0.5">✓</span>}
                {preset.label}
              </button>
            ))}
          </div>
          {/* Calendar */}
          <div className="p-1 rdp-compact">
            <DayPicker
              mode="range"
              defaultMonth={value?.from}
              selected={value ? { from: value.from, to: value.to } : undefined}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onChange({ from: range.from, to: range.to });
                  setActivePreset('');
                } else if (range?.from) {
                  onChange({ from: range.from, to: range.from });
                  setActivePreset('');
                }
              }}
              numberOfMonths={2}
              locale={ar}
              dir="rtl"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
