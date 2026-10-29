type Props = { index?: string; children: React.ReactNode; className?: string };

/** Small uppercase label, e.g. "01 / About". */
export function SectionLabel({ index, children, className = "" }: Props) {
  return (
    <p className={`label text-ink-2 flex items-center gap-3 ${className}`}>
      {index ? <span className="tabular">{index}</span> : null}
      {index ? <span aria-hidden="true">/</span> : null}
      <span>{children}</span>
    </p>
  );
}
