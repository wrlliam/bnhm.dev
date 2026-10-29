export type Link = { label: string; href: string; handle: string };

export const profile = {
  name: "William Banham",
  shortName: "WB",
  handle: "wrlliam",
  site: "https://bnhm.dev",
  role: "Full-stack developer, infrastructure & network engineer.",
  tagline: "I build software, and the infrastructure it runs on.",
  supporting: "Derbyshire, UK. Studying Computer Science at Lincoln.",
  location: "Derbyshire, UK",
  timeZone: "Europe/London",
  // Coarse (1 d.p.) design detail only.
  coords: "53.1° N, 1.6° W",
  bio: [
    "I'm self-taught on both sides of the stack: the software, and the infrastructure underneath it. For more than five years I've built and run virtual infrastructure on my own equipment, and for just as long I've freelanced, delivering reliable, high-performance work for clients across industries, YouTube creators among them. E-commerce platforms, portfolio sites, automation tools and bots.",
    "I work mostly in React, Go and TypeScript, lean heavily on containers and cloud platforms, and think in systems: performance and reliability come from automation, not heroics. I'm a national silver medallist in Web Development at WorldSkills UK, and I'm now studying Computer Science at the University of Lincoln.",
  ],
  highlights: [
    {
      label: "WorldSkills UK",
      value: "Silver medallist, Web Development, National Competitions 2025",
    },
    { label: "Skills Fest", value: "First-ever gold winner in digital" },
    { label: "Freelance", value: "Self-taught; freelancing since Sep 2020" },
    { label: "Homelab", value: "Running since Jul 2020" },
  ],
  chip: "WorldSkills UK · Silver 2025",
  links: [
    { label: "GitHub", href: "https://github.com/wrlliam", handle: "wrlliam" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/william-banham/",
      handle: "william-banham",
    },
  ] satisfies Link[],
} as const;

export const seo = {
  title: "William Banham · Full-stack developer, infrastructure & network engineer",
  description:
    "William Banham is a self-taught full-stack developer and infrastructure engineer in Derbyshire, UK, building fast, reliable software and the systems it runs on.",
} as const;
