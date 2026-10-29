"use client";

import dynamic from "next/dynamic";

/** Loads the motion runtime as a separate chunk after hydration. */
const MotionRoot = dynamic(() => import("./motion-root"), { ssr: false });

export function MotionBoot() {
  return <MotionRoot />;
}
