import { profile } from "@/content/profile";

const STEPS = [
  { id: "fonts", label: "typeface" },
  { id: "page", label: "page" },
  { id: "motion", label: "motion" },
  { id: "sound", label: "sound" },
] as const;

// Six generic units, matching The Rack section. Each powers up when the
// counter passes its threshold (percent).
const UNITS = ["Edge", "Network", "Compute", "Compute", "Storage", "Monitor"] as const;
const threshold = (i: number) => 4 + i * 15;

/**
 * Preloader: a rack booting up. Every unit's LEDs and drive bar are driven in
 * CSS from one eased --gate-p animation (run by the boot script in
 * layout.tsx); the boot log ticks "ok" as real loading steps finish
 * (html.gs-*). The motion runtime enters by itself once everything is ready.
 *
 * The previous loader is kept in gate-classic.tsx as a backup.
 */
export function Gate() {
  return (
    <div className="gate gate-boot" data-gate>
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
            Jupiter · cold boot
          </p>
        </div>

        <div className="boot-centre" data-gate-piece>
          <div className="boot-rack" aria-hidden="true">
            <span className="boot-rail boot-rail-l" />
            <span className="boot-rail boot-rail-r" />
            {UNITS.map((name, i) => (
              <div
                key={i}
                className="boot-unit"
                data-gate-unit
                data-gate-p
                style={{ "--t": threshold(i) } as React.CSSProperties}
              >
                <span className="boot-leds">
                  <span className="boot-led" />
                  <span className="boot-led boot-led-b" />
                </span>
                <span className="boot-name tabular">
                  U{String(i + 1).padStart(2, "0")} <span>{name}</span>
                </span>
                <span className="boot-drive">
                  <span />
                </span>
              </div>
            ))}
          </div>

          <p className="boot-count tabular" aria-hidden="true">
            <span className="label">Boot</span>
            <span className="gate-count-num boot-num" data-gate-p />
            <span className="boot-pct">%</span>
          </p>
        </div>

        <div className="gate-bottom boot-bottom" data-gate-piece>
          <ul className="boot-log tabular" aria-hidden="true">
            {STEPS.map((s) => (
              <li key={s.id} data-step={s.id}>
                <span className="boot-log-key">{s.label}</span>
                <span className="boot-log-dots">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="boot-log-state" />
              </li>
            ))}
          </ul>
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
