"use client";

import Image from "next/image";

import HopeFourULogo from "@/assets/companies/hope4u.jpeg";
import PrezzoLTD from "@/assets/companies/prezzo_ltd_logo.jpeg";
import BnhmDev from "@/assets/companies/Logo.png";
import { motion } from "motion/react";
import React from "react";
import Tag from "./Tag";
import Link from "./Link";
import { CornerDownRight, FolderSymlink } from "lucide-react";

export const EXPERIENCE = [
  {
    title: "Administrator",
    company: "Hope 4U",
    location: "On-site",
    timeFrame: "July 2025 - Sept 2025",
    description:
      "In my role at Hope 4U, I focused on data input and analysis, collaborating with teams to drive informed decision-making. My contributions led to significant improvements in operational efficiency and project outcomes, showcasing the impact of data-driven strategies in a startup environment.",
  },
  {
    title: "Freelance",
    company: "bnhm.dev",
    location: "On-site & Remote",
    timeFrame: "September 2020 - Present",
    description:
      "I specialize in building and maintaining efficient, secure, and scalable systems for clients across various industries.",
  },
  // {
  //   title: "Kitchen Assistant",
  //   company: "Prezzo",
  //   location: "On-site",
  //   timeFrame: "June 2024 - June 2025",
  //   description:
  //     "Dedicated and efficient Kitchen Assistant/KP with experience in maintaining cleanliness, managing stock, and contributing to a fast-paced cooking environment.",
  // },
].sort((a, b) => {
  const aIsPresent = a.timeFrame.toLowerCase().includes("present");
  const bIsPresent = b.timeFrame.toLowerCase().includes("present");

  if (aIsPresent && !bIsPresent) return -1;
  if (!aIsPresent && bIsPresent) return 1;

  return 0;
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

export const PROJECTS = [
  {
    name: "Homelab",
    description:
      "Building a on site lab gaining real world experience and being able to craft a space to have a dedicated area to present and better my skills. Consiting of a Dell Poweredge R730, A fujitsu RX200 S8 and a Dell 24 Port 1Gb/s Switch",
    timeFrame: "June 2020* - Present",

    more: "/home-lab",
  },
];

export default function SubModule() {
  return (
    <div className="flex  flex-col md:flex-row gap-3 mt-[2rem]">
      <motion.div
        variants={generalVariants}
        transition={{ delay: 2.72 }}
        initial="hidden"
        animate="visable"
        className="bg-gray-50/25 w-full md:w-[45%] border border-black/5 rounded-md"
      >
        <h1 className="uppercase text-xs opacity-50  mx-4 mt-4">
          My experience
        </h1>
        <ExperienceMap />
      </motion.div>
      <motion.div
        variants={generalVariants}
        transition={{ delay: 2.75 }}
        initial="hidden"
        animate="visable"
        className="flex flex-col gap-2 w-full md:w-[45%]"
      >
        <motion.div
          variants={generalVariants}
          transition={{ delay: 2.78 }}
          initial="hidden"
          animate="visable"
          className="bg-gray-50/25 h-[50%]  w-full border border-black/5 rounded-md"
        >
          <h1 className="uppercase text-xs opacity-50 mx-4 mt-4">
            What can i do?
          </h1>
          <WhatCanIdo />
        </motion.div>
        <motion.div
          variants={generalVariants}
          transition={{ delay: 2.82 }}
          initial="hidden"
          animate="visable"
          className="bg-gray-50/25 h-[50%] w-full border border-black/5 rounded-md"
        >
          <h1 className="uppercase text-xs opacity-50 mx-4 mt-4">Currently</h1>
          <Projects />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Projects() {
  return (
    <div className="flex   flex-col gap-3">
      {PROJECTS.map((z, i) => (
        <div
          key={z.name}
          className={`flex flex-col justify-start ${
            i >= PROJECTS.length - 1 ? "" : "border-b border-b-black/10"
          } pb-2 pt-2  px-4`}
        >
          <p className="text-[10px] opacity-60 mb-1">{z.timeFrame}</p>
          <h1 className="font-semibold">{z.name}</h1>
          <p className="text-xs">{z.description}</p>

          {z.more && (
            <Link
              className="text-[10px] group flex justify-between bg-accent-main uppercase font-semibold mt-2 text-white px-[12px] py-[10px] rounded-md "
              href={z.more}
            >
              View More
              <CornerDownRight className="text-white opacity-0 smooth_transition h-[15px] group-hover:opacity-100" />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export function WhatCanIdo() {
  return (
    <div className="grid grid-cols-3 gap-1 mx-4 pb-2 pt-2 text-white">
      <WhatCanIDoCard className="bg-orange-600/40 border-orange-600/20 col-span-3   text-orange-600">
        Full-Stack Developer
      </WhatCanIDoCard>
      <WhatCanIDoCard className="bg-red-600/40 border-red-600/20 col-span-2 text-red-600 ">
        Infrastructure Engineer
      </WhatCanIDoCard>
      <WhatCanIDoCard className="bg-blue-600/40 border-blue-600/20 col-span-1 text-blue-600">
        Network Engineer
      </WhatCanIDoCard>

      <WhatCanIDoCard className="bg-pink-600/40 border-pink-600/20 col-span-3 text-pink-600">
        Motion Design
      </WhatCanIDoCard>
      <WhatCanIDoCard className="bg-teal-600/40 border-teal-600/20 col-span-2 text-teal-600 ">
        Content Creation
      </WhatCanIDoCard>
      <WhatCanIDoCard className="bg-cyan-600/40 border-cyan-600/20 col-span-1 text-cyan-600">
        Web Design
      </WhatCanIDoCard>
    </div>
  );
}

export type WhatCanIDoCardProps = {
  className: string;
  children: React.ReactElement | React.ReactNode;
};
export function WhatCanIDoCard(props: WhatCanIDoCardProps) {
  return (
    <div
      className={`${props.className} border  scale-[1] hover:scale-[1.05] smooth_transition p-2 rounded-md`}
    >
      <h1>{props.children}</h1>
    </div>
  );
}

export function ExperienceMap() {
  return (
    <div className="flex h-fit flex-col gap-3">
      {EXPERIENCE.map((z, i) => (
        <div
          key={i}
          className={`flex flex-col justify-start ${
            i >= EXPERIENCE.length - 1 ? "" : "border-b border-b-black/10"
          } pb-2 pt-2  px-4`}
        >
          <h1 className="font-bold">
            {z.title} @ {z.company}
          </h1>
    
          <p className="text-xs opacity-30">{z.timeFrame}</p>
          <p className="mt-2 text-xs">{z.description}</p>
        </div>
      ))}
    </div>
  );
}
