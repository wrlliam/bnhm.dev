import { projects } from "@/content/projects";
import { SectionLabel } from "@/components/ui/section-label";
import { ArrowUpRight } from "@/components/ui/icons";
import { ProjectBody } from "./project-body";
import { WorkArt } from "./work-art";
import { WorkInteractions } from "./work-interactions";

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="shell section relative">
      <div className="hairline" data-hairline />
      <div className="grid-12 gap-y-8 pt-8">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel index="02">Selected work</SectionLabel>
        </div>
        <h2
          id="work-title"
          className="display col-span-12 text-[clamp(64px,13vw,220px)] md:col-span-8"
          data-split
        >
          Work
          <span className="text-ink-2 align-super text-[0.4em] tracking-[-0.02em]">
            ’26
          </span>
        </h2>
      </div>

      <ol className="work-list border-rule mt-16 border-t md:mt-24" data-work-list>
        {projects.map((p, i) => (
          <li
            key={p.slug}
            className="work-row border-rule border-b"
            data-work-row={p.slug}
            data-index={i}
          >
            <a
              href={`?p=${p.slug}#project-${p.slug}`}
              className="work-link grid-12 items-baseline gap-y-2 py-7 md:py-9"
              data-work-link={p.slug}
              data-cursor="view"
              aria-describedby={`work-sum-${p.slug}`}
            >
              <span className="label tabular text-ink-2 col-span-2 md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="col-span-10 md:col-span-6">
                <span className="work-title block text-[clamp(30px,4.6vw,68px)] leading-[1.02] font-semibold tracking-[-0.03em]">
                  {p.title}
                </span>
              </span>
              <span className="text-ink-2 col-span-10 col-start-3 text-[15px] md:col-span-3 md:col-start-auto">
                {p.meta}
                {p.status && p.status !== p.meta ? ` · ${p.status}` : null}
              </span>
              <span className="col-span-12 hidden justify-end md:col-span-2 md:flex">
                <ArrowUpRight className="work-arrow" size={28} />
              </span>
              <span
                id={`work-sum-${p.slug}`}
                className="text-ink-2 col-span-10 col-start-3 text-[15px] md:col-span-6 md:col-start-2"
              >
                {p.summary}
              </span>
            </a>

            {/* Full details: visible without JS; with JS they open in the detail view. */}
            <div
              id={`project-${p.slug}`}
              className="work-inline grid-12 pb-10"
              data-work-inline
            >
              <div className="col-span-12 md:col-span-6 md:col-start-2">
                <ProjectBody project={p} summary={false} />
              </div>
              <div className="col-span-12 mt-8 md:col-span-4 md:col-start-9 md:mt-0">
                <div className="bg-surface text-accent aspect-[32/22] rounded-2xl p-6">
                  <WorkArt art={p.art} className="size-full" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <WorkInteractions />
    </section>
  );
}
