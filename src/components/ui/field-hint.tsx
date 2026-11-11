/** the validation rule of a field, shown right under it */
export function FieldHint({ children }: { children: React.ReactNode }): JSX.Element {
  return <p className="text-[11px] leading-relaxed text-muted-foreground">{children}</p>;
}
