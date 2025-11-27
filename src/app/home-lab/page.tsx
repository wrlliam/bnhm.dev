"use client";

import { generalVariants } from "@/components/Hero";
import Link from "@/components/Link";
import { motion } from "motion/react";

export default function HomeLab() {
  return (
    <div className="flex flex-col gap-3">
      <motion.h1
        className="text-lg font-semibold"
        variants={generalVariants}
        transition={{ delay: 2.6 }}
        initial="hidden"
        animate="visable"
      >
        My Homelab
      </motion.h1>
      <motion.p className="w-[750px] text-sm">
        My homelab is built for power and flexibility. It features a Dell
        PowerEdge R730, a Fujitsu SX200 S8, and an HP 24-port Gigabit switch,
        along with essentials like a patch panel and PDU. It’s a solid setup for
        testing, learning, and running projects my way.
      </motion.p>
    </div>
  );
}
