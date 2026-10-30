import { profile } from "@/content/profile";

const STEPS = [
  { id: "fonts", label: "Typeface" },
  { id: "page", label: "Page" },
  { id: "motion", label: "Motion" },
  { id: "sound", label: "Sound" },
] as const;

/**
 * BACKUP LOADER: the original counter + step lights preloader.
 * To use it again, swap <Gate /> for <GateClassic /> in src/app/page.tsx
 * (both lines are there, one commented out). Same contract as the current
 * gate: [data-gate], [data-gate-half], [data-gate-piece], [data-gate-p],
 * html.gs-* step classes, driven by the boot script and the motion runtime.
 */
export function GateClassic() {
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
            <span className="gate-count-num" data-gate-p />
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
            <span data-gate-p />
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
