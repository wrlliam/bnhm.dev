import { profile } from "@/content/profile";

const STEPS = [
  { id: "fonts", label: "Typeface" },
  { id: "page", label: "Page" },
  { id: "motion", label: "Motion" },
  { id: "sound", label: "Sound" },
] as const;

/**
 * Server-rendered preloader. Only displayed when JS runs and this is the
 * first visit of the session. The boot script (layout.tsx) runs the eased
 * counter and marks real loading steps; the motion runtime enters by itself
 * once everything is ready. No interaction needed.
 */
export function Gate() {
  return (
    <div className="gate" data-gate>
      <div className="gate-half gate-half-top" data-gate-half="top" aria-hidden="true" />
      <div
        className="gate-half gate-half-bottom"
        data-gate-half="bottom"
        aria-hidden="true"
      />

      <div className="gate-inner" data-gate-inner>
        <div className="gate-top" data-gate-piece>
          <p className="label" aria-hidden="true">
            {profile.name}
          </p>
          <p className="label tabular" aria-hidden="true">
            Portfolio · ’26
          </p>
        </div>

        <div className="gate-centre" data-gate-piece>
          <p className="gate-count tabular" aria-hidden="true">
            <span className="gate-count-num" />
            <span className="gate-count-unit">%</span>
          </p>
          <ul className="gate-steps" aria-hidden="true">
            {STEPS.map((s) => (
              <li key={s.id} data-step={s.id}>
                <span className="gate-led" />
                <span className="label">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="gate-bottom" data-gate-piece>
          <div className="gate-bar" aria-hidden="true">
            <span />
          </div>
          <p className="gate-note text-[14px]" aria-hidden="true">
            Sound on. It starts with your first click; mute any time from the header.
          </p>
          <p className="sr-only" role="status" data-gate-status>
            Loading {profile.name}&rsquo;s portfolio
          </p>
        </div>
      </div>
    </div>
  );
}
