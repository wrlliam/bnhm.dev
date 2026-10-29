import { alsoRoles, experience } from "@/content/experience";
import { SectionLabel } from "@/components/ui/section-label";

export function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="shell section below-fold"
    >
      <div className="hairline" data-hairline />
      <div className="grid-12 gap-y-12 pt-8">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="03">Experience</SectionLabel>
        </div>
        <div className="col-span-12 md:col-span-8">
          <h2
            id="experience-title"
            className="display text-[clamp(36px,5.2vw,84px)]"
            data-split
          >
            Where I&rsquo;ve put it to work.
          </h2>

          <ol className="timeline relative mt-14 md:mt-20" data-timeline>
            <span className="timeline-track" aria-hidden="true" />
            <span
              className="timeline-progress"
              aria-hidden="true"
              data-timeline-progress
            />
            {experience.map((r) => (
              <li
                key={r.org}
                className="relative pb-14 pl-10 last:pb-0 md:pl-14"
                data-batch-item
              >
                <span className="timeline-dot" aria-hidden="true" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-[clamp(22px,2.2vw,30px)] leading-tight font-semibold tracking-[-0.02em]">
                    {r.org}
                  </h3>
                  <p className="label tabular text-ink-2">{r.period}</p>
                </div>
                <p className="mt-1 font-medium">
                  {r.title}
                  <span className="text-ink-2"> · {r.place}</span>
                </p>
                <ul className="prose-body text-ink-2 mt-4 space-y-2">
                  {r.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span
                        className="mt-[0.75em] h-px w-3 shrink-0 bg-current"
                        aria-hidden="true"
                      />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <div className="mt-20">
            <h3 className="label text-ink-2">Also</h3>
            <ul className="border-rule mt-4 border-t">
              {alsoRoles.map((r) => (
                <li
                  key={r.title}
                  className="border-rule flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b py-4"
                >
                  <span>
                    <span className="font-semibold">{r.org}</span>
                    <span className="text-ink-2">
                      {" "}
                      · {r.title}
                      {r.place ? `, ${r.place}` : ""}
                    </span>
                  </span>
                  <span className="tabular text-ink-2 text-[15px]">{r.period}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
