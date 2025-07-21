"use client";

import { Playfair_Display } from "next/font/google";
import { motion } from "motion/react";
const playFairDisplay = Playfair_Display({
  style: "italic",
});

const generalVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visable: {
    opacity: 1,
    y: 0,
  },
};

export default function Hero() {
  return (
    <motion.h1 className="text-3xl flex flex-wrap gap-1">
      <motion.span
        variants={generalVariants}
        transition={{ delay: 2.6 }}
        initial="hidden"
        animate="visable"
      >
        Hey, I'm
      </motion.span>
      <motion.span
        variants={generalVariants}
        transition={{ delay: 2.63 }}
        initial="hidden"
        animate="visable"
      >
        <span className={playFairDisplay.className}>William Banham</span>.
      </motion.span>
      <motion.span
        variants={generalVariants}
        transition={{ delay: 2.66 }}
        initial="hidden"
        animate="visable"
      >
        A Full-stack Developer aswell as the
      </motion.span>
      <motion.span
        variants={generalVariants}
        transition={{ delay: 2.69 }}
        initial="hidden"
        animate="visable"
      >
        occasional Infra & Network Engineer.
      </motion.span>
    </motion.h1>
  );
}
