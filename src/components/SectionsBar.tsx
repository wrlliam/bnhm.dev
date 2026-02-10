"use client";

import { motion } from "motion/react";

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

export const sections = [
  {
    name: "Education",
    href: "education",
  },
  {
    name: "Projects",
    href: "projects",
  },
];

export default function Sectionbar() {
  return (
    <motion.div
      variants={generalVariants}
      initial="hidden"
      animate="visable"
      className="flex gap-2 text-sm w-full mt-6"
    >
      {sections.map((section) => (
        <motion.a
          key={section.href}
          className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded-sm"
          onClick={() => {
            try {
              document?.getElementById(section.href)?.scrollIntoView({
                behavior: "smooth",
              });
            } catch (err) {
                console.log(err)
            }
          }}
        >
          {section.name}
        </motion.a>
      ))}
    </motion.div>
  );
}
