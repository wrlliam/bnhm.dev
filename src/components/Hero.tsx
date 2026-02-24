"use client";

import { Playfair_Display } from "next/font/google";
import { motion } from "motion/react";
const playFairDisplay = Playfair_Display({
  style: "italic",
  subsets: ["latin"],
});

export const generalVariants = {
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
    <motion.h1 className=" text-2xl md:text-3xl flex flex-wrap gap-1">
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
        className="my-2"
      >
        A{" "}
        <span className="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md">
          Full-stack Developer
        </span>{" "}
        and an
      </motion.span>
      <motion.span
        variants={generalVariants}
        transition={{ delay: 2.69 }}
        initial="hidden"
        animate="visable"
      >
        <span className="text-accent-main bg-accent-main/10 px-2 py-1 rounded-md">
          Infra & Network Engineer.
        </span>
      </motion.span>
    </motion.h1>
  );
}
