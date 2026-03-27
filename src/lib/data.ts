export type Project = {
  name: string;
  description: string;
  url?: string;
  github?: string;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  logo?: string;
};

export const PROJECTS: Project[] = [
  {
    name: "Digi",
    description:
      "Self-hosted PaaS for deploying apps from GitHub repos or Docker images onto Proxmox VMs.",
    github: "https://github.com/rundigi/digi",
  },
  {
    name: "bnhm.dev",
    description: "My 2025 & onwards portfolio.",
    url: "https://bnhm.dev",
    github: "https://github.com/wrlliam/bnhm.dev",
  },
  {
    name: "Stratum Shop",
    description: "E-commerce platform for selling 3D printed products.",
    github: "https://stratum3d.co.uk",
  },
  {
    name: "Mylo",
    description:
      "Mobile chores app — reward those who keep habits and make boring tasks fun for your kids.",
    github: "https://github.com/wrlliam/mylo",
  },
  {
    name: "Baitin",
    description:
      "Discord fishing economy bot with pets, marketplace, and player economies.",
    github: "https://baitin.site",
  },
  {
    name: "Homelab",
    description:
      "Enterprise-grade home infrastructure. Dell R730, Fujitsu servers, 10Gbps fiber networking.",
  },
];

export const EXPERIENCE: Experience[] = [
  {
    company: "bnhm.dev",
    role: "Freelance",
    period: "Sep 2020 — Present",
  },
  {
    company: "Sainsbury's",
    role: "Online Assistant",
    period: "March 2026 — Present",
  },
  {
    company: "Rolls-Royce",
    role: "Work Experience",
    period: "Feb 2026",
  },
  {
    company: "Sainsbury's",
    role: "Temporary Retail Assistant",
    period: "Nov 2025 — Jan 2026",
  },
  {
    company: "Hope 4U",
    role: "Temporary Administrator",
    period: "Jul 2025 — Sep 2025",
    logo: "/companies/hope4u.jpeg",
  },
  {
    company: "Prezzo",
    role: "Kitchen Assistant",
    period: "Jun 2024 — Jun 2025",
    logo: "/companies/prezzo_ltd_logo.jpeg",
  },
];

export const SOCIAL_LINKS = [
  { label: "GitHub", url: "https://github.com/wrlliam" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/william-banham/" },
  { label: "Instagram", url: "https://www.instagram.com/will_banha/" },
];
