export type Project = {
  slug: string;
  title: string;
  /** Dates, or a short descriptor where no dates are given. */
  meta: string;
  status?: string;
  tech: string[];
  summary: string;
  details: string[];
  chips?: string[];
  /** Optional screenshot at public/work/<slug>.webp. None supplied yet. */
  image?: string;
  /** Generated preview art variant. */
  art: "rack" | "shield" | "grid" | "link" | "orbit";
};

export const projects: Project[] = [
  {
    slug: "jupiter",
    title: "Homelab “Jupiter”",
    meta: "Jul 2020 – present",
    tech: ["Proxmox"],
    summary:
      "An evolving rack of compute and networking, used as an isolated lab and for real hosting.",
    details: [
      "Runs web hosting, game servers, backups and media.",
      "Services sit behind reverse proxies on zero-trust and mesh-VPN networking, with SSO, DNS filtering, a self-hosted PaaS and monitoring.",
      "Every service is named after a figure from mythology.",
    ],
    // TODO(william): confirm which homelab details you are happy to show publicly.
    chips: ["Dual Xeon E5-2699 v4", "88 threads", "94 GB RAM"],
    art: "rack",
  },
  {
    slug: "api",
    title: "api.bnhm.dev",
    meta: "Personal project",
    tech: ["NestJS", "Drizzle ORM", "Docker", "Kubernetes"],
    summary:
      "A NestJS API with proper role-based access control and a full delivery pipeline.",
    details: [
      "Role-based access control through a custom @Roles() decorator and authorisation guard.",
      "Drizzle ORM, Argon2id password hashing with OWASP parameters, and invite-based signup.",
      "Forgejo Actions CI/CD builds Docker images and deploys them to Kubernetes.",
    ],
    art: "shield",
  },
  {
    slug: "ims",
    title: "IMS",
    meta: "Inventory Management System",
    tech: ["NestJS", "Next.js", "PostgreSQL", "DaisyUI"],
    summary: "Inventory management with a NestJS back end and a Next.js front end.",
    details: [
      "Drizzle ORM on PostgreSQL, with pagination and search.",
      "A DaisyUI front end with drawers, modals and optimistic updates.",
    ],
    art: "grid",
  },
  {
    slug: "gohop",
    title: "goHop",
    meta: "In development",
    status: "In development",
    tech: ["Next.js", "better-auth", "SQLite", "shadcn/ui"],
    summary: "Share links, track their popularity, and get paid for views.",
    details: [
      "better-auth, Drizzle on SQLite and shadcn/ui.",
      "Per-link analytics, plus expiring, max-view and password-protected redirects.",
    ],
    art: "link",
  },
  {
    slug: "client-work",
    title: "Client work",
    meta: "2020 – present",
    tech: ["Automation", "Bots", "E-commerce"],
    summary:
      "Automation tools, bots, e-commerce platforms and portfolio sites, mainly for YouTube creators.",
    details: [
      "Owned each project end to end, from requirements and design to deployment and maintenance.",
      // TODO(william): add named case studies here if you want them public.
      "Named case studies to follow.",
    ],
    art: "orbit",
  },
];
