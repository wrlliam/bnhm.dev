import { stack } from "@/content/stack";
import { SectionLabel } from "@/components/ui/section-label";
import { Marquee } from "./marquee";

export function Stack() {
  const all = stack.flatMap((g) => g.items);
  return (
    <section id="stack" aria-labelledby="stack-title" className="section below-fold">
      <div className="shell">
        <div className="hairline" data-hairline />
        <div className="grid-12 gap-y-12 pt-8">
          <div className="col-span-12 md:col-span-4">
            <SectionLabel>Stack</SectionLabel>
          </div>
          <div className="col-span-12 md:col-span-8">
            <h2
              id="stack-title"
              className="display text-[clamp(36px,5.2vw,84px)]"
              data-split
            >
              Tools I reach for.
            </h2>
            <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-8">
              {stack.map((g) => (
                <div key={g.name}>
                  <h3 className="label text-ink-2">{g.name}</h3>
                  <ul className="mt-5 flex flex-wrap gap-2" data-batch>
                    {g.items.map((t) => (
                      <li key={t} className="chip text-[14px]" data-batch-item>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Marquee items={all} />
    </section>
  );
}
