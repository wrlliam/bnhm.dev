import { EXPERIENCE } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-20">
      <span className="text-xs font-medium uppercase tracking-widest text-neutral-400">
        Experience
      </span>

      <div className="mt-4 flex flex-col gap-1">
        {EXPERIENCE.map((item, i) => (
          <div
            key={`${item.company}-${i}`}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 group"
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-[15px] font-medium text-neutral-900">
                  {item.company}
                </span>
                <span className="text-sm text-neutral-400">{item.role}</span>
              </div>
            </div>
            <span className="text-sm text-neutral-400 shrink-0 sm:ml-4 ml-0 mt-0.5 sm:mt-0">
              {item.period}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
