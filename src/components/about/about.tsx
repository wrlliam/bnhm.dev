import { profile } from "@/content/profile";
import { SectionLabel } from "@/components/ui/section-label";
import { ArrowUpRight } from "@/components/ui/icons";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="shell section">
      <div className="hairline" data-hairline />
      <div className="grid-12 gap-y-12 pt-8">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="01">About</SectionLabel>
        </div>
        <div className="col-span-12 md:col-span-8">
          <h2
            id="about-title"
            className="display text-[clamp(36px,5.2vw,84px)]"
            data-split
          >
            Software and systems, end to end.
          </h2>
          <div className="text-ink-2 mt-10 space-y-6 md:mt-14" data-reveal-lines>
            {profile.bio.map((p) => (
              <p key={p.slice(0, 24)} className="prose-body">
                {p}
              </p>
            ))}
          </div>

          <ul
            className="border-rule bg-rule mt-14 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2"
            data-batch
          >
            {profile.highlights.map((h) => (
              <li key={h.label} className="bg-bg p-6" data-batch-item>
                <p className="label text-ink-2">{h.label}</p>
                <p className="mt-3 text-[17px] leading-snug font-medium">{h.value}</p>
              </li>
            ))}
          </ul>

          <ul className="mt-10 flex flex-wrap gap-3">
            {profile.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip hover:bg-surface min-h-11 gap-2 px-4 text-[15px] font-medium transition-colors"
                  data-cursor="link"
                >
                  {l.label}
                  <span className="text-ink-2">@{l.handle}</span>
                  <ArrowUpRight size={16} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
