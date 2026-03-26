"use client";

import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <motion.div
        initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.26, 1, 0.6, 1] }}
        className="flex flex-col items-center gap-4"
      >
        <span className="text-7xl font-semibold text-neutral-200">404</span>
        <p className="text-[15px] text-neutral-500">
          This page doesn&apos;t exist.
        </p>
        <a
          href="/"
          className="mt-4 flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 smooth_transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back home
        </a>
      </motion.div>
    </div>
  );
}
