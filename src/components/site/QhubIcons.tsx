// منسوخ من qhub-site/src/components/ui/Icons.tsx — أيقونات Qhub المرسومة يدوياً.
// حُذف منه FeatureIcon فقط. لا تعدّل الرسوم هنا: عدّل الأصل ثم انسخه.

type P = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const wrap = (className: string | undefined, children: React.ReactNode) => (
  <svg viewBox="0 0 24 24" className={className ?? "size-5"} aria-hidden {...stroke}>
    {children}
  </svg>
);

export const Icons = {
  inbox: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M3 12h4l1.5 2.5h7L17 12h4" />
        <path d="M4.6 5.4 3 12v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5l-1.6-6.6A2 2 0 0 0 17.5 4h-11a2 2 0 0 0-1.9 1.4Z" />
      </>,
    ),
  sparkles: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M12 3.5 13.7 8.3 18.5 10 13.7 11.7 12 16.5 10.3 11.7 5.5 10 10.3 8.3Z" />
        <path d="M18.5 15.5 19.3 17.7 21.5 18.5 19.3 19.3 18.5 21.5 17.7 19.3 15.5 18.5 17.7 17.7Z" />
      </>,
    ),
  /*
    وجه المساعد. النجمة رمز «سحر» عامّ يستعمله كل منتج لأي شيء ذكي، أمّا
    الصورة الرمزية فتمثّل مُحاوِراً — فالوجه أصدق منها. والعينان تَطرفان
    بحركة CSS (‎qh-bot-eye‎ في globals) فيُقرأ حيّاً لا أيقونةً ساكنة.
  */
  bot: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M12 3.2v2.3" />
        <circle cx="12" cy="2.6" r="1" />
        <rect x="3.6" y="5.5" width="16.8" height="13" rx="4.2" />
        <path d="M1.8 10.5v3M22.2 10.5v3" />
        <path d="M9.2 10.6v1.6" className="qh-bot-eye" />
        <path d="M14.8 10.6v1.6" className="qh-bot-eye" />
        <path d="M9.6 15h4.8" />
      </>,
    ),
  megaphone: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M3 11v2a2 2 0 0 0 2 2h2l7 4V5L7 9H5a2 2 0 0 0-2 2Z" />
        <path d="M17.5 9.2a4 4 0 0 1 0 5.6M20 6.8a7.5 7.5 0 0 1 0 10.4" />
      </>,
    ),
  users: ({ className }: P) =>
    wrap(
      className,
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19.5a5.5 5.5 0 0 1 11 0" />
        <path d="M16 5.5a3.2 3.2 0 0 1 0 5M17.5 14.5a5.5 5.5 0 0 1 3 5" />
      </>,
    ),
  chart: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </>,
    ),
  widget: ({ className }: P) =>
    wrap(
      className,
      <>
        <rect x="3" y="4" width="18" height="13" rx="2.5" />
        <path d="M8 21l3-4M16 21l-3-4" />
        <path d="M7.5 9h9M7.5 12.5h5" />
      </>,
    ),
  plug: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M9 3v5M15 3v5" />
        <path d="M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8Z" />
        <path d="M12 17v4" />
      </>,
    ),
  check: ({ className }: P) =>
    wrap(className, <path d="m5 12.5 4.5 4.5L19 7" strokeWidth={2} />),
  chevron: ({ className }: P) => wrap(className, <path d="m6 9 6 6 6-6" />),
  /** سهم باتجاه القراءة — مرسوم لليسار، وينقلب أفقياً في الإنجليزية. */
  arrowStart: ({ className }: P) =>
    wrap(`${className ?? ""} ltr:-scale-x-100`, <path d="M19 12H5M12 19l-7-7 7-7" />),
  bolt: ({ className }: P) =>
    wrap(className, <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />),
  shield: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M12 3 4.5 6v6c0 4.4 3.1 8.2 7.5 9 4.4-.8 7.5-4.6 7.5-9V6L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </>,
    ),
  clock: ({ className }: P) =>
    wrap(
      className,
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>,
    ),
  globe: ({ className }: P) =>
    wrap(
      className,
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.4-3.3-8.5S9.8 5.9 12 3.5Z" />
      </>,
    ),
  store: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M4 9.5V19a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 20 19V9.5" />
        <path d="M3 6.5 4.5 3.5h15L21 6.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z" />
      </>,
    ),
  building: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M4 21V6.5a2 2 0 0 1 1.3-1.9l6-2.2a2 2 0 0 1 2.7 1.9V21" />
        <path d="M14 10h4.5a2 2 0 0 1 2 2V21" />
        <path d="M2.5 21h19" />
        <path d="M7.5 8.5h3M7.5 12h3M7.5 15.5h3M17 14h1M17 17.5h1" />
      </>,
    ),
  heart: ({ className }: P) =>
    wrap(
      className,
      <path d="M12 20s-7.5-4.4-7.5-9.3A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.5 2.5C19.5 15.6 12 20 12 20Z" />,
    ),
  stethoscope: ({ className }: P) =>
    wrap(
      className,
      <>
        <path d="M6 3v5a4 4 0 0 0 8 0V3" />
        <path d="M10 12v2a5 5 0 0 0 10 0v-1" />
        <circle cx="20" cy="11" r="1.8" />
      </>,
    ),
  briefcase: ({ className }: P) =>
    wrap(
      className,
      <>
        <rect x="3" y="7.5" width="18" height="12" rx="2" />
        <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12.5h18" />
      </>,
    ),
  camera: ({ className }: P) =>
    wrap(
      className,
      <>
        <rect x="3" y="6.5" width="18" height="13" rx="2.5" />
        <circle cx="12" cy="13" r="3.5" />
        <path d="M8 6.5 9.2 4h5.6l1.2 2.5" />
      </>,
    ),
  sun: ({ className }: P) =>
    wrap(
      className,
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4" />
      </>,
    ),
  moon: ({ className }: P) =>
    wrap(className, <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />),
  menu: ({ className }: P) =>
    wrap(className, <path d="M4 7h16M4 12h16M4 17h16" strokeWidth={1.8} />),
  close: ({ className }: P) =>
    wrap(className, <path d="M6 6l12 12M18 6 6 18" strokeWidth={1.8} />),
  play: ({ className }: P) =>
    wrap(className, <path d="M8 5.5v13l10-6.5-10-6.5Z" />),
  send: ({ className }: P) =>
    wrap(className, <path d="M20 4 3.5 10.5l6.5 2.5 2.5 6.5L20 4Z" />),
} satisfies Record<string, (p: P) => React.ReactElement>;
