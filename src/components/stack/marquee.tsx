import { MarqueePlayer } from "./marquee-player";

/** Decorative, CSS-only strip. Duplicated once for a seamless loop. */
export function Marquee({ items }: { items: string[] }) {
  const row = (
    <ul className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center">
          <span className="px-6 text-[clamp(28px,4vw,56px)] font-semibold tracking-[-0.03em] whitespace-nowrap">
            {t}
          </span>
          <span className="bg-decor size-2 rounded-full" />
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className="marquee border-rule text-ink-2 mt-24 overflow-hidden border-y py-6 md:mt-32"
      aria-hidden="true"
      data-marquee
    >
      <div className="marquee-track">
        {row}
        {row}
      </div>
      <MarqueePlayer />
    </div>
  );
}
