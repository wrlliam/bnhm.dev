import { GlowingEffect } from "./ui/glowing-effect";
import { LinkPreview } from "./ui/link-preview";
import { PixelatedCanvas } from "./ui/pixelated-canvas";
import linkedinBanner from "@/assets/Linkedin Banner - Personal.png";
import { motion } from "motion/react";
export const EXPERIENCE = [
  {
    title: "Temporary Administrator",
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
  {
    title: "Kitchen Assistant",
    company: "Prezzo",
    location: "On-site",
    timeFrame: "June 2024 - June 2025",
    description:
      "Dedicated and efficient Kitchen Assistant/KP with experience in maintaining cleanliness, managing stock, and contributing to a fast-paced cooking environment.",
  },
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

export function ColModuleExperience() {
  return (
    <div className="flex flex-col w-full mt-[3rem]">
      <motion.h1
        variants={generalVariants}
        transition={{ delay: 2.72 }}
        initial="hidden"
        animate="visable"
        className="uppercase text-xs opacity-60"
      >
        My Experience
      </motion.h1>
      <div className="flex flex-col gap-[2rem] mt-3">
        {EXPERIENCE.map((exp, index) => (
          <motion.div
            variants={generalVariants}
            transition={{ delay: 2.72 + index * 0.1 }}
            initial="hidden"
            animate="visable"
            key={index}
            className="flex flex-col relative  bg-neutral-900/20 p-3 rounded-md"
          >
            <GlowingEffect
              key={index}
              spread={40}
              glow={true}
              disabled={false}
              className=""
              proximity={64}
              inactiveZone={0.01}
            />
            <h2 className="font-semibold text-lg">
              {exp.title} <span className="opacity-50">@ {exp.company}</span>
            </h2>
            <span className="text-sm italic opacity-70">
              {exp.location}, {exp.timeFrame}
            </span>
            <p className="mt-2 text-xs">{exp.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ColModuleAbout() {
  return (
    <div className="flex flex-col w-full mt-[3rem]">
      <motion.h1
        className="uppercase text-xs opacity-60"
        variants={generalVariants}
        transition={{ delay: 2.72 }}
        initial="hidden"
        animate="visable"
      >
        ABOUT ME
      </motion.h1>
      <motion.div
        variants={generalVariants}
        transition={{ delay: 2.72 }}
        initial="hidden"
        animate="visable"
        className="flex flex-col relative mt-3  bg-neutral-900/20 p-3 rounded-md"
      >
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          className=""
          proximity={64}
          inactiveZone={0.01}
        />
        <p className="text-sm">
          Current finalist in{" "}
          <LinkPreview url="https://www.worldskillsuk.org">
            WorldSkills UK
          </LinkPreview>{" "}
          and student. Full-stack developer with eight years’ experience
          building web applications across front-end and back-end. I also run a
          personal homelab, managing servers, containers and private-cloud
          infrastructure to support my interest in infrastructure and systems.
        </p>
      </motion.div>
    </div>
  );
}
