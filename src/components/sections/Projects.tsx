"use client";

import Link from "@/components/Link";
import { PROJECTS } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-20">
      <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
        Projects
      </span>

      <div className="mt-4 flex flex-col gap-1">
        {PROJECTS.map((project) => {
          const href = project.url || project.github;

          return (
            <div
              key={project.name}
              className="flex items-start justify-between py-2.5 group"
            >
              <div className="flex flex-col gap-0.5">
                {href ? (
                  <Link url={href} side="top" className="!text-neutral-900">
                    <span className="text-[15px] font-medium inline-flex items-center gap-1">
                      {project.name}
                      <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-600 smooth_transition" />
                    </span>
                  </Link>
                ) : (
                  <span className="text-[15px] font-medium text-neutral-900">
                    {project.name}
                  </span>
                )}
                <span className="text-sm text-neutral-400">
                  {project.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
