"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, m } from "motion/react";
import { projects, type Project } from "@/content/projects";
import { ProjectBody } from "@/components/work/project-body";
import { WorkArt } from "@/components/work/work-art";
import { Close } from "@/components/ui/icons";
import { playHoverSound, playSound } from "@/audio/state";
import { Flip } from "gsap/Flip";
import { gsap, useGSAP } from "./gsap";
import { startScroll, stopScroll } from "./lenis";
import { duration, ease, media } from "./tokens";

gsap.registerPlugin(Flip);

const bySlug = new Map(projects.map((p) => [p.slug, p]));
const reduced = () => window.matchMedia(media.reduce).matches;
const rowOf = (slug: string) =>
  document.querySelector<HTMLElement>(`[data-work-row="${slug}"]`);
const linkOf = (slug: string) =>
  document.querySelector<HTMLElement>(`[data-work-link="${slug}"]`);

function urlSlug(): string | null {
  const s = new URLSearchParams(location.search).get("p");
  return s && bySlug.has(s) ? s : null;
}

function setUrl(slug: string | null, mode: "push" | "replace") {
  const url = new URL(location.href);
  if (slug) url.searchParams.set("p", slug);
  else url.searchParams.delete("p");
  url.hash = "";
  history[mode === "push" ? "pushState" : "replaceState"]({ p: slug }, "", url);
}

/** Work list enhancements: hover preview, then an in-page detail view via Flip. */
export function WorkDetail() {
  const [slug, setSlug] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const pushed = useRef(false);

  const open = useCallback((next: string, how: "push" | "replace" | "none") => {
    const row = rowOf(next);
    const visible =
      row &&
      row.getBoundingClientRect().bottom > 0 &&
      row.getBoundingClientRect().top < innerHeight;
    flipState.current = visible && !reduced() ? Flip.getState(row) : null;
    returnFocus.current = linkOf(next);
    if (how !== "none") setUrl(next, how);
    pushed.current = how === "push";
    playSound("sweep");
    setSlug(next);
  }, []);

  const close = useCallback((how: "push" | "replace" | "none") => {
    if (closing.current) return;
    const current = panel.current;
    const slugNow = current?.dataset.flipId;
    if (!current || !slugNow) return;
    closing.current = true;
    playSound("sweepClose");
    if (how !== "none") setUrl(null, how);
    const row = rowOf(slugNow);
    const done = () => {
      closing.current = false;
      setSlug(null);
    };
    const tl = gsap.timeline({ onComplete: done });
    tl.to(content.current, { autoAlpha: 0, duration: 0.2, ease: "power2.in" });
    const r = row?.getBoundingClientRect();
    if (row && r && r.bottom > 0 && r.top < innerHeight && !reduced()) {
      tl.add(
        Flip.fit(current, row, {
          duration: 0.6,
          ease: ease.inOut,
          scale: true,
        }) as gsap.core.Tween,
      );
    } else {
      tl.to(current, { autoAlpha: 0, duration: duration.fade * 2 });
    }
  }, []);

  /** UI close: step back through history if we added the entry. */
  const requestClose = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      history.back(); // popstate closes the panel
    } else close("replace");
  }, [close]);

  // Wire the server-rendered list.
  useEffect(() => {
    const list = document.querySelector<HTMLElement>("[data-work-list]");
    if (!list) return;
    list.classList.add("work-enhanced");

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLElement>("[data-work-link]");
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      open(link.dataset.workLink!, "push");
    };
    const onOver = (e: PointerEvent) => {
      const row = (e.target as Element).closest<HTMLElement>("[data-work-row]");
      if (!row || row.contains(e.relatedTarget as Node)) return;
      playHoverSound("tick", { index: Number(row.dataset.index ?? 0) });
    };
    const onPop = () => {
      const s = urlSlug();
      if (s) open(s, "none");
      else close("none");
    };
    list.addEventListener("click", onClick);
    list.addEventListener("pointerover", onOver);
    window.addEventListener("popstate", onPop);

    // Deep link (?p=slug): open once the gate is out of the way.
    const initial = urlSlug();
    const openInitial = () => initial && open(initial, "none");
    if (initial) {
      if (document.documentElement.classList.contains("entered")) openInitial();
      else window.addEventListener("bnhm:entered", openInitial, { once: true });
    }
    return () => {
      list.classList.remove("work-enhanced");
      list.removeEventListener("click", onClick);
      list.removeEventListener("pointerover", onOver);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("bnhm:entered", openInitial);
    };
  }, [open, close]);

  // Open animation, scroll lock, inert background, focus management.
  useLayoutEffect(() => {
    const el = panel.current;
    if (!slug || !el) return;
    const outside = ["[data-header]", "#main", "footer"]
      .map((q) => document.querySelector<HTMLElement>(q))
      .filter((n): n is HTMLElement => Boolean(n));
    outside.forEach((n) => (n.inert = true));
    stopScroll();
    el.scrollTop = 0;

    const ctx = gsap.context(() => {
      // Opacity only (not visibility) so the close button can take focus immediately.
      gsap.set(content.current, { opacity: 0, y: 16 });
      const state = flipState.current;
      const tl = gsap.timeline();
      if (state) {
        tl.add(
          Flip.from(state, {
            targets: el,
            duration: 0.75,
            ease: ease.inOut,
            scale: true,
          }),
        );
      } else {
        tl.fromTo(
          el,
          { opacity: 0 },
          { opacity: 1, duration: reduced() ? duration.fade : 0.35 },
        );
      }
      tl.to(
        content.current,
        { autoAlpha: 1, y: 0, duration: duration.ui, ease: ease.out },
        "-=0.15",
      );
    });
    el.querySelector<HTMLElement>("[data-detail-close]")?.focus({ preventScroll: true });

    return () => {
      ctx.revert();
      outside.forEach((n) => (n.inert = false));
      startScroll();
      returnFocus.current?.focus({ preventScroll: true });
    };
  }, [slug]);

  // Esc to close, Tab stays inside.
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      requestClose();
      return;
    }
    if (e.key !== "Tab" || !panel.current) return;
    const focusables = panel.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const project = slug ? bySlug.get(slug) : undefined;
  const index = project ? projects.indexOf(project) : -1;

  // Client-only module (loaded with ssr: false), so document is always available.
  return (
    <>
      <WorkPreview />
      {createPortal(
        <AnimatePresence>
          {project ? (
            <m.div
              key="backdrop"
              className="detail-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: ease.soft }}
              onClick={() => requestClose()}
              aria-hidden="true"
            />
          ) : null}
          {project ? (
            <div
              key="panel"
              ref={panel}
              className="detail-panel"
              data-flip-id={project.slug}
              role="dialog"
              aria-modal="true"
              aria-labelledby="detail-title"
              data-lenis-prevent
              onKeyDown={onKeyDown}
              tabIndex={-1}
            >
              <DetailContent
                project={project}
                index={index}
                contentRef={content}
                onClose={() => requestClose()}
              />
            </div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function DetailContent({
  project,
  index,
  contentRef,
  onClose,
}: {
  project: Project;
  index: number;
  contentRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  return (
    <div ref={contentRef} className="shell py-8 md:py-12">
      <div className="flex items-center justify-between gap-4">
        <p className="label tabular text-ink-2">
          {String(index + 1).padStart(2, "0")} / Selected work
        </p>
        <button
          type="button"
          className="icon-btn border-rule border"
          onClick={onClose}
          data-detail-close
          aria-label="Close project"
        >
          <Close />
        </button>
      </div>
      <div className="grid-12 mt-10 gap-y-10 md:mt-16">
        <div className="col-span-12 lg:col-span-7">
          <h2 id="detail-title" className="display text-[clamp(48px,8vw,128px)]">
            {project.title}
          </h2>
          <p className="text-ink-2 mt-4">
            {project.meta}
            {project.status && project.status !== project.meta
              ? ` · ${project.status}`
              : null}
          </p>
          <div className="mt-10">
            <ProjectBody project={project} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <div className="bg-surface text-accent aspect-[32/22] rounded-2xl p-6">
            <WorkArt art={project.art} className="size-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Cursor-following preview card; transform-only, lerped with quickTo. */
function WorkPreview() {
  const card = useRef<HTMLDivElement>(null);
  const [art, setArt] = useState<Project["art"] | null>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${media.fine} and ${media.motion}`, () => {
      const list = document.querySelector<HTMLElement>("[data-work-list]");
      const el = card.current;
      if (!list || !el) return;
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const rot = gsap.quickTo(el, "rotation", { duration: 0.8, ease: "power3.out" });
      let lastX = 0;

      const move = (e: PointerEvent) => {
        x(e.clientX + 56);
        y(e.clientY - 90);
        rot(gsap.utils.clamp(-6, 6, (e.clientX - lastX) * 0.4));
        lastX = e.clientX;
      };
      const over = (e: PointerEvent) => {
        const row = (e.target as Element).closest<HTMLElement>("[data-work-row]");
        if (!row) return;
        const p = bySlug.get(row.dataset.workRow!);
        if (p) setArt(p.art);
      };
      const enter = (e: PointerEvent) => {
        gsap.set(el, { x: e.clientX + 56, y: e.clientY - 90 });
        lastX = e.clientX;
        gsap.to(el, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.35,
          ease: ease.out,
          overwrite: "auto",
        });
      };
      const leave = () =>
        gsap.to(el, { autoAlpha: 0, scale: 0.9, duration: 0.25, overwrite: "auto" });

      gsap.set(el, { autoAlpha: 0, scale: 0.9 });
      list.addEventListener("pointermove", move, { passive: true });
      list.addEventListener("pointerover", over, { passive: true });
      list.addEventListener("pointerenter", enter);
      list.addEventListener("pointerleave", leave);
      return () => {
        list.removeEventListener("pointermove", move);
        list.removeEventListener("pointerover", over);
        list.removeEventListener("pointerenter", enter);
        list.removeEventListener("pointerleave", leave);
      };
    });
    return () => mm.revert();
  });

  return createPortal(
    <div ref={card} className="work-preview" aria-hidden="true">
      {projects.map((p) => (
        <WorkArt
          key={p.slug}
          art={p.art}
          className={`work-preview-art ${art === p.art ? "is-active" : ""}`}
        />
      ))}
    </div>,
    document.body,
  );
}
