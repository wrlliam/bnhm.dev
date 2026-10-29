export type Role = {
  org: string;
  title: string;
  place: string;
  period: string;
  points: string[];
};

export type MinorRole = { org: string; title: string; place?: string; period: string };

export const experience: Role[] = [
  {
    org: "bnhm.dev",
    title: "Founder",
    place: "Remote, UK",
    period: "Sep 2020 – present",
    points: [
      "Design and build full-stack software for YouTube content creators: automation tools, bots and e-commerce.",
      "Deliver reliable, scalable, secure applications, owning the whole lifecycle from requirements and design to deployment and maintenance.",
      "Run virtual infrastructure on my own equipment with Proxmox VE, Docker and Kubernetes.",
    ],
  },
  {
    org: "Rolls-Royce",
    title: "Volunteer",
    place: "Derby",
    period: "Feb 2026",
    points: [
      "Applied data analytics to forecast and predict from real operational data.",
      "Supported the in-house IT and support teams.",
      "Saw how projects move from planning through to delivery.",
    ],
  },
  {
    org: "Hope4U",
    title: "Temporary Administrator",
    place: "Burton upon Trent",
    period: "Jul – Sep 2025",
    points: [
      "Supported a finance and benefits team handling confidential client data.",
      "Automated reporting and workflows in advanced Excel.",
      "Provided front-line IT and admin support in a call-centre setting.",
    ],
  },
  {
    org: "Pennine Way Junior Academy",
    title: "Teaching Assistant / IT Support (volunteer)",
    place: "Swadlincote",
    // TODO(william): add dates for this role.
    period: "Volunteer",
    points: [
      "Supported computing lessons with one-to-one and group tutoring.",
      "Handled IT setup and troubleshooting, and suggested classroom infrastructure improvements.",
    ],
  },
];

export const alsoRoles: MinorRole[] = [
  {
    org: "Sainsbury's",
    title: "Online Assistant",
    place: "Swadlincote",
    period: "Mar 2026 – present",
  },
  {
    org: "Sainsbury's",
    title: "Temporary Retail Assistant",
    period: "Nov 2025 – Jan 2026",
  },
  { org: "Prezzo", title: "Kitchen Assistant", period: "Jun 2024 – Jul 2025" },
];
