"use client";
import Image from "next/image";
import MajourLogo from "@/assets/Major Logo.svg";
import Link from "./Link";
import { motion } from "motion/react";
import { SquareArrowOutUpRight, SquareArrowUpRight } from "lucide-react";
import { SiGithub, SiInstagram } from "@icons-pack/react-simple-icons";

export default function NavigationBar() {
  return (
    <motion.div className="h-[85vh] w-[8rem] items-start    flex flex-col justify-between overflow-hidden">
      <motion.div
        transition={{
          delay: 2.6,
        }}
        initial={{
          x: -20,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 100,
        }}
        className="flex flex-col gap-3"
      >
        <Image
          src={MajourLogo}
          alt="Logo"
          className="invert w-[40px]"
          draggable={false}
        />
        <p className="uppercase text-xs">Building Dreams, Line By Line</p>
      </motion.div>
      <div className="flex flex-col gap-1">
        <motion.div
          transition={{
            delay: 2.8,
          }}
          initial={{
            y: -10,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 100,
          }}
          className="flex gap-2"
        >
          <Link className="group" href="https://www.instagram.com/will_banha/">
            <SiInstagram className="w-[15px] group-hover:fill-accent-main smooth_transition" />
          </Link>
          <Link className="group" href="https://github.com/wrlliam/">
            <SiGithub className="w-[15px] group-hover:fill-accent-main smooth_transition" />
          </Link>
        </motion.div>
        <motion.a
          transition={{
            delay: 2.6,
          }}
          initial={{
            y: -10,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 100,
          }}
          className="text-xs flex gap-2 justify-center items-center"
          href="mailto:will@bhnm.dev"
        >
          will@bhnm.dev
        </motion.a>
      </div>
    </motion.div>
  );
}
