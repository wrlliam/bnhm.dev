import { certifications, education } from "@/content/education";
import { SectionLabel } from "@/components/ui/section-label";

export function Education() {
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="shell section below-fold"
    >
      <div className="hairline" data-hairline />
      <div className="grid-12 gap-y-12 pt-8">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="04">Education &amp; certifications</SectionLabel>
        </div>
        <div className="col-span-12 md:col-span-8">
          <h2
            id="education-title"
            className="display text-[clamp(36px,5.2vw,84px)]"
            data-split
          >
            Still learning, on purpose.
          </h2>
          <ul className="border-rule mt-14 border-t md:mt-20" data-batch>
            {education.map((e) => (
              <li
                key={e.place}
                className="border-rule grid gap-x-8 gap-y-2 border-b py-8 md:grid-cols-[1fr_auto]"
                data-batch-item
              >
                <div>
                  <h3 className="text-[clamp(20px,2vw,26px)] leading-tight font-semibold tracking-[-0.02em]">
                    {e.place}
                  </h3>
                  <p className="mt-1 font-medium">{e.award}</p>
                  {e.notes.map((n) => (
                    <p key={n} className="prose-body text-ink-2 mt-2">
                      {n}
                    </p>
                  ))}
                </div>
                <p className="label tabular text-ink-2 md:pt-2 md:text-right">
                  {e.period}
                </p>
              </li>
            ))}
          </ul>

          <h3 className="label text-ink-2 mt-16">Certifications</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3" data-batch>
            {certifications.map((c) => (
              <li
                key={c.name}
                className="border-rule rounded-2xl border p-5"
                data-batch-item
              >
                <p className="leading-snug font-medium">{c.name}</p>
                <p className="label tabular text-ink-2 mt-3">{c.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
