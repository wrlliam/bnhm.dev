import { profile } from "@/content/profile";

/**
 * Server-rendered gate. Only displayed when JS runs and this is the first
 * visit of the session (see the boot script in layout.tsx). The motion
 * runtime drives the counter and the exit.
 */
export function Gate() {
  return (
    <div
      className="gate"
      data-gate
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      aria-describedby="gate-desc"
    >
      <div className="gate-half gate-half-top" data-gate-half="top" aria-hidden="true" />
      <div
        className="gate-half gate-half-bottom"
        data-gate-half="bottom"
        aria-hidden="true"
      />
      <div className="gate-inner" data-gate-inner>
        <p id="gate-title" className="label text-sky">
          {profile.name} <span aria-hidden="true">·</span> Portfolio
        </p>
        <p className="gate-count tabular" aria-hidden="true" data-gate-count>
          000
        </p>
        <div className="gate-bar" aria-hidden="true">
          <span data-gate-bar />
        </div>
        <p className="sr-only" role="status" data-gate-status>
          Loading
        </p>
        <div className="gate-actions" data-gate-actions>
          <p id="gate-desc" className="text-sky text-[15px]">
            Tiny, optional sounds. Off unless you say so.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" className="btn btn-solid" data-gate-enter="sound">
              Enter with sound
            </button>
            <button type="button" className="btn btn-ghost" data-gate-enter="silent">
              Enter silently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
