import { MarqueePlayer } from "./marquee-player";

/** Decorative, CSS-only strip. Duplicated once for a seamless loop. */
export function Marquee({ items }: { items: string[] }) {
  const row = (
    <p className="shrink-0 px-3 text-[clamp(28px,4vw,56px)] font-semibold tracking-[-0.03em] whitespace-nowrap">
      {items.map((t) => `${t}\u2002·\u2002`).join("")}
    </p>
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
