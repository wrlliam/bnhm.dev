"use client";

import { useCallback } from "react";

const u = "will";
const d = "bnhm.dev";

export default function Footer() {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = `mailto:${u}@${d}`;
  }, []);

  return (
    <footer className="pt-16 pb-8 flex flex-col gap-1">
      <a
        href="#contact"
        id="reach-out"
        onClick={handleClick}
        className="text-sm text-neutral-400 hover:text-neutral-600 smooth_transition"
      >
        {u}&#64;{d}
      </a>
      <span className="text-sm text-neutral-300">
        &copy; {new Date().getFullYear()}
      </span>
    </footer>
  );
}
