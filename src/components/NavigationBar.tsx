"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

const NAV_LINKS = [
  { label: "about", href: "#about" },
  { label: "experience", href: "#experience" },
  { label: "projects", href: "#projects" },
  { label: "contact", href: "#reach-out" },
];

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        className="absolute inset-0 bg-white/80 backdrop-blur-xs border-b border-neutral-100"
        style={{ opacity: bgOpacity }}
      />
      <div className="relative max-w-[46rem] mx-auto px-6 h-14 flex items-center justify-end">
        <div
          className="hidden sm:flex items-center gap-1"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHovered(i)}
              className="relative text-xs text-neutral-400 hover:text-neutral-900 smooth_transition px-3 py-1.5"
            >
              <AnimatePresence>
                {hovered === i && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-neutral-900/[0.06] rounded-md"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      layout: { type: "spring", stiffness: 400, damping: 30 },
                      opacity: { duration: 0.15 },
                      scale: { duration: 0.15 },
                    }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
