import {
  Link,
  SquareArrowOutUpRightIcon,
  SquareArrowRightIcon,
} from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";
import { LinkPreview } from "./ui/link-preview";
import { motion } from "motion/react";
import { useState } from "react";

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  "Next.js": { bg: "bg-blue-500/10", text: "text-blue-500" },
  TypeScript: { bg: "bg-blue-700/10", text: "text-blue-700" },
  "Tailwind CSS": { bg: "bg-teal-500/10", text: "text-teal-500" },
  Drizzle: { bg: "bg-green-500/10", text: "text-green-500" },
  SQlite: { bg: "bg-orange-500/10", text: "text-orange-500" },
  "Better-Auth": { bg: "bg-purple-500/10", text: "text-purple-500" },
  "Polar.sh": { bg: "bg-pink-500/10", text: "text-pink-500" },
  APIs: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
  Linux: { bg: "bg-green-600/10", text: "text-green-700" },
  Networking: { bg: "bg-cyan-500/10", text: "text-cyan-500" },
  Virtualization: { bg: "bg-purple-500/10", text: "text-purple-500" },
  Docker: { bg: "bg-blue-400/10", text: "text-blue-400" },
  Proxmox: { bg: "bg-orange-600/10", text: "text-orange-600" },
  Bash: { bg: "bg-green-700/10", text: "text-green-700" },
  Databases: { bg: "bg-rose-500/10", text: "text-rose-500" },
};

export const PROJECTS = [
  {
    title: "Homelab",
    description:
      "My homelab is a high-performance, enterprise-style setup that mirrors real-world infrastructure. It runs on a 10 Gbps fiber-backed network with a Unifi Pro Max 16 switch and organised patch panel. The core includes a primary Dell PowerEdge R730 and a Fujitsu SX200 S8, supported by a NAS and a custom 4U workstation PC for development and testing. This environment highlights my hands-on skills in advanced networking, virtualization, systems administration, and hardware optimisation.",
    href: "https://bnhm.dev",
    tags: [
      "Linux",
      "Networking",
      "Virtualization",
      "Docker",
      "Proxmox",
      "Bash",
      "Databases",
    ],
  },
  {
    title: "Revis",
    description:
      "A full-featured flashcard application built with Next.js, featuring multiple authentication methods, spaced repetition learning, and comprehensive statistics tracking. Also my first real attempt to seeing how a powerful LLM could be useful in a real world secnario.",
    href: "https://revis.bnhm.dev",
    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Drizzle",
      "SQlite",
      "Better-Auth",
      "Polar.sh",
    ],
  },
  {
    title: "Swift Tasks",
    description:
      "A fully-featured task management system built for a college assignment, featuring secure authentication, full task CRUD operations, Canvas LMS integration, and a responsive UI using Next.js and Tailwind CSS. The backend uses a SQLite database with Drizzle ORM. This project not only met the requirements but also gave me the opportunity to teach classmates advanced web technologies through a real-world example.",
    href: "https://swifttasks.bnhm.dev",
    tags: [
      "TypeScript",
      "SQlite",
      "Better-Auth",
      "APIs",
      "Next.js",
      "Tailwind CSS",
      "Drizzle",
    ],
  },
];

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

const iconVariants = {
  rest: { scale: 1, opacity: 0.45 },
  hover: { scale: 1.25, opacity: 1 },
};

function ProjectCard({ project, index }: any) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={project.href}
      variants={generalVariants}
      transition={{ delay: 2.72 + index * 0.1 }}
      initial="hidden"
      animate="visable"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex flex-col relative bg-neutral-900/20 p-3 rounded-md group"
      target="_blank"
      rel="noopener noreferrer"
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
      <h2 className="font-semibold text-lg">{project.title}</h2>
      <motion.span
        aria-hidden
        initial={{ scale: 1, opacity: 0.45 }}
        animate={
          hovered ? { scale: 1.25, opacity: 1 } : { scale: 1, opacity: 0.45 }
        }
        className="absolute top-2 right-2 w-5 h-5 p-1 flex items-center justify-center text-xs text-neutral-400"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Link />
      </motion.span>
      <span className="text-sm flex gap-2 mb-1 mt-2">
        {project.tags.map((tag: string, index:number) => {
          const color = TAG_COLORS[tag] || {
            bg: "bg-neutral-700/10",
            text: "text-neutral-400",
          };
          return (
            <div
              key={index}
              className={`${color.bg} ${color.text} px-2 rounded-sm`}
            >
              {tag}
            </div>
          );
        })}
      </span>
      <p className="mt-2 text-sm">{project.description}</p>
    </motion.a>
  );
}

export function ColModuleExperience() {
  return (
    <div className="flex flex-col w-full mt-12">
      <motion.h1
        variants={generalVariants}
        transition={{ delay: 2.72 }}
        initial="hidden"
        animate="visable"
        className="uppercase text-xs opacity-60"
      >
        My Experience
      </motion.h1>
      <div className="flex flex-col gap-8 mt-3">
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
            <p className="mt-2 text-sm">{exp.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ColModuleProjects() {
  return (
    <div className="flex flex-col w-full mt-12">
      <motion.h1
        variants={generalVariants}
        transition={{ delay: 2.72 }}
        initial="hidden"
        animate="visable"
        className="uppercase text-xs opacity-60"
      >
        My Projects
      </motion.h1>
      <div className="flex flex-col gap-8 mt-3">
        {PROJECTS.map((project, index) => (
          <ProjectCard project={project} index={index} key={index} />
        ))}
      </div>
    </div>
  );
}

export function ColModuleAbout() {
  return (
    <div className="flex flex-col w-full mt-12">
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
          Silver finalist at{" "}
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
