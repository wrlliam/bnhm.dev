"use client";

import { motion } from "motion/react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Footer from "@/components/sections/Footer";

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: {
    delay: 0.5 + i * 0.12,
    duration: 0.6,
    ease: [0.26, 1, 0.6, 1] as const,
  },
});

export default function Root() {
  return (
    <div className="flex flex-col">
      <motion.div {...stagger(0)} className="relative z-20 mb-[4rem]">
        <Hero />
      </motion.div>

      {/* <motion.hr {...stagger(1)} className="border-neutral-100 mt-16 mb-16" /> */}

      <motion.div {...stagger(1)} className="relative z-[5]">
        <About />
      </motion.div>

      <motion.hr {...stagger(2)} className="border-neutral-100 mt-16 mb-16" />

      <motion.div {...stagger(3)} className="relative z-10">
        <Experience />
      </motion.div>

      <motion.hr {...stagger(4)} className="border-neutral-100 mt-16 mb-16" />

      <motion.div {...stagger(5)} className="relative z-10">
        <Projects />
      </motion.div>

      <motion.div {...stagger(6)} className="relative z-10">
        <Footer />
      </motion.div>
    </div>
  );
}
