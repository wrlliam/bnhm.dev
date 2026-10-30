import type { Project } from "@/content/projects";
import { ArrowUpRight } from "@/components/ui/icons";

/** Shared detail content: rendered inline (no JS) and in the detail view. */
export function ProjectBody({
  project,
  summary = true,
}: {
  project: Project;
  summary?: boolean;
}) {
  return (
    <div className="space-y-6">
      {summary ? (
        <p className="text-[clamp(20px,1.8vw,26px)] leading-snug font-medium tracking-[-0.01em] text-balance">
          {project.summary}
        </p>
      ) : null}
      <ul className="prose-body text-ink-2 space-y-3">
        {project.details.map((d) => (
          <li key={d} className="flex gap-3">
            <span
              className="mt-[0.7em] h-px w-3 shrink-0 bg-current"
              aria-hidden="true"
            />
            <span>{d}</span>
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-2" aria-label="Technology">
        {[...project.tech, ...(project.chips ?? [])].map((t) => (
          <li key={t} className="chip text-[13px]">
            {t}
          </li>
        ))}
      </ul>
      {project.links?.length ? (
        <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Links">
          {project.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex min-h-11 items-center gap-2 font-medium"
                data-cursor="link"
              >
                {l.label}
                <ArrowUpRight size={16} />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
