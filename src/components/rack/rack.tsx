import { rackUnits } from "@/content/stack";
import { SectionLabel } from "@/components/ui/section-label";
import { RackInteractions } from "./rack-interactions";

const blink = ["2.4s", "3.1s", "1.9s", "2.7s", "3.6s", "2.2s"];

export function Rack() {
  return (
    <section id="rack" aria-labelledby="rack-title" className="shell section below-fold">
      <div className="hairline" data-hairline />
      <div className="grid-12 gap-y-12 pt-8">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel>The rack</SectionLabel>
          <h2
            id="rack-title"
            className="display mt-8 text-[clamp(36px,4.4vw,64px)]"
            data-split
          >
            Jupiter, in brief.
          </h2>
          <p className="prose-body text-ink-2 mt-6">
            The homelab I&rsquo;ve run since 2020: an isolated lab and real hosting in one
            rack. Hover a unit to see what it does.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Hardware">
            {["Dual Xeon E5-2699 v4", "88 threads", "94 GB RAM"].map((c) => (
              <li key={c} className="chip text-[13px]">
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <div
            className="rack border-rule bg-surface relative rounded-2xl border p-3 sm:p-5"
            data-rack
          >
            <svg
              className="rack-rail left-1.5 sm:left-2"
              viewBox="0 0 8 400"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {Array.from({ length: 20 }, (_, i) => (
                <rect key={i} x="2" y={8 + i * 20} width="4" height="4" rx="1" />
              ))}
            </svg>
            <svg
              className="rack-rail right-1.5 sm:right-2"
              viewBox="0 0 8 400"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {Array.from({ length: 20 }, (_, i) => (
                <rect key={i} x="2" y={8 + i * 20} width="4" height="4" rx="1" />
              ))}
            </svg>
            <ul className="relative space-y-2 px-3 sm:px-4" aria-label="Rack units">
              {rackUnits.map((u, i) => (
                <li
                  key={u.id}
                  className="rack-unit group border-rule bg-bg flex min-h-16 items-center gap-4 rounded-lg border px-4 py-3"
                  data-rack-unit={i}
                >
                  <svg
                    width="26"
                    height="10"
                    viewBox="0 0 26 10"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <circle
                      className="rack-led"
                      cx="5"
                      cy="5"
                      r="3"
                      style={
                        {
                          "--blink": blink[i],
                          "--delay": `-${i * 0.37}s`,
                        } as React.CSSProperties
                      }
                    />
                    <circle
                      className="rack-led"
                      cx="17"
                      cy="5"
                      r="3"
                      style={
                        {
                          "--blink": blink[(i + 3) % 6],
                          "--delay": `-${i * 0.61}s`,
                        } as React.CSSProperties
                      }
                    />
                  </svg>
                  <span className="rack-label min-w-0 flex-1">
                    <span className="label tabular text-ink-2 mr-3">
                      U{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-semibold">{u.label}</span>
                    <span className="rack-role text-ink-2 block text-[15px] leading-snug sm:inline sm:before:content-['_·_']">
                      {u.role}
                    </span>
                  </span>
                  <svg
                    width="56"
                    height="16"
                    viewBox="0 0 56 16"
                    aria-hidden="true"
                    className="text-rule hidden shrink-0 sm:block"
                  >
                    {Array.from({ length: 8 }, (_, j) => (
                      <rect
                        key={j}
                        x={j * 7}
                        y="2"
                        width="3"
                        height="12"
                        rx="1.5"
                        fill="currentColor"
                      />
                    ))}
                  </svg>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-ink-2 mt-4 text-[14px]">
            Generic units shown; service names and network details stay private.
          </p>
        </div>
      </div>
      <RackInteractions />
    </section>
  );
}
