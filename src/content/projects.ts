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
  /** Public links, shown in the detail view. */
  links?: { label: string; href: string }[];
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
    title: "Personal API",
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
  // {
  //   slug: "ims",
  //   title: "IMS",
  //   meta: "Inventory Management System",
  //   tech: ["NestJS", "Next.js", "PostgreSQL", "DaisyUI"],
  //   summary: "Inventory management with a NestJS back end and a Next.js front end.",
  //   details: [
  //     "Drizzle ORM on PostgreSQL, with pagination and search.",
  //     "A DaisyUI front end with drawers, modals and optimistic updates.",
  //   ],
  //   art: "grid",
  // },
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
    links: [
      { label: "gohop.site", href: "https://gohop.site" },
      { label: "Source", href: "https://github.com/wrlliam/gohop" },
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

  // ------------------------------------------------------------------------
  // More from github.com/wrlliam. Uncomment the ones you want on the site.
  // Facts come from each repo's name, description, language, topics and
  // dates; add details or links if you want more in the detail view.
  // ------------------------------------------------------------------------

  // {
  //   slug: "blimp",
  //   title: "Blimp",
  //   meta: "Oct 2025",
  //   tech: ["TypeScript", "Bun", "Elysia", "Next.js", "discord.js"],
  //   summary:
  //     "A Discord bot that makes server management effortless, configured from a web dashboard.",
  //   details: ["Custom greetings, automated moderation and unique experiences, all set up from an intuitive dashboard."],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/blimp" }],
  //   art: "orbit",
  // },
  // {
  //   slug: "namerr",
  //   title: "Namerr",
  //   meta: "Dec 2025",
  //   tech: ["TypeScript", "Docker"],
  //   summary: "An *arr-style media management system with automated renaming.",
  //   details: ["Seerr API integration and Docker support."],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/Namerr" }],
  //   art: "grid",
  // },
  // {
  //   slug: "mylo",
  //   title: "Mylo",
  //   meta: "Oct 2025",
  //   tech: ["TypeScript", "Mobile"],
  //   summary: "A mobile chores app that rewards kids for keeping habits and makes boring tasks fun.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/mylo" }],
  //   art: "grid",
  // },
  // {
  //   slug: "stratum-shop",
  //   title: "Stratum Shop",
  //   meta: "Mar 2026",
  //   tech: ["TypeScript", "E-commerce"],
  //   summary: "An e-commerce site for 3D printing.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/stratum-shop" }],
  //   art: "grid",
  // },
  // {
  //   slug: "baitin",
  //   title: "Baitin",
  //   meta: "Mar 2026",
  //   tech: ["TypeScript"],
  //   summary: "Ever wanted to be a fisherman? Now you can.",
  //   details: ["Comes with its own landing page."],
  //   links: [
  //     { label: "Source", href: "https://github.com/wrlliam/baitin" },
  //     { label: "Landing page source", href: "https://github.com/wrlliam/Baitin-landing" },
  //   ],
  //   art: "orbit",
  // },
  // {
  //   slug: "djs-template",
  //   title: "discord.js template",
  //   meta: "Mar 2026",
  //   tech: ["TypeScript", "discord.js", "Drizzle ORM", "PostgreSQL", "Redis"],
  //   summary: "A fully featured Discord bot template in TypeScript.",
  //   details: ["Built on discord.js, Drizzle ORM, PostgreSQL and Redis."],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/djs-template" }],
  //   art: "shield",
  // },
  // {
  //   slug: "igloo",
  //   title: "Igloo",
  //   meta: "Nov 2025",
  //   tech: ["TypeScript", "CLI"],
  //   summary: "Cluster-based updating and command-line tooling.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/igloo" }],
  //   art: "rack",
  // },
  // {
  //   slug: "proxmon",
  //   title: "Proxmon",
  //   meta: "Apr 2025",
  //   tech: ["TypeScript", "Proxmox"],
  //   summary: "Modernising the plain Proxmox summary page, with extras.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/proxmon" }],
  //   art: "rack",
  // },
  // {
  //   slug: "scripts",
  //   title: "Scripts",
  //   meta: "Jan 2025",
  //   tech: ["Shell", "Proxmox"],
  //   summary: "A hub of Proxmox (and not-Proxmox) scripts.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/scripts" }],
  //   art: "rack",
  // },
  // {
  //   slug: "homelab",
  //   title: "Homelab scripts",
  //   meta: "Apr 2025",
  //   tech: ["Docker", "Shell"],
  //   summary: "Homelab scripts, Docker setups and more.",
  //   // Check the repo exposes nothing that maps your network before linking it.
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/homelab" }],
  //   art: "rack",
  // },
  // {
  //   slug: "vibw",
  //   title: "vibw",
  //   meta: "Jan 2025",
  //   tech: ["TypeScript"],
  //   summary: "Virtual-instance-based workers.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/vibw" }],
  //   art: "rack",
  // },
  // {
  //   slug: "virosa",
  //   title: "Virosa",
  //   meta: "Nov 2024",
  //   tech: ["Next.js 15", "TypeScript"],
  //   summary: "A Next.js 15 boilerplate built with modern tooling to make future builds simpler.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/virosa" }],
  //   art: "grid",
  // },
  // {
  //   slug: "shop-nextjs",
  //   title: "Next.js shop",
  //   meta: "Oct 2024",
  //   tech: ["Next.js 14", "Stripe", "Lucia Auth", "Drizzle ORM", "PostgreSQL"],
  //   summary: "An e-commerce website with Stripe payments and Lucia authentication.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/shop-nextjs-clerk-stripe" }],
  //   art: "grid",
  // },
  // {
  //   slug: "audibily",
  //   title: "Audibily",
  //   meta: "Oct 2024",
  //   tech: ["Audio"],
  //   summary: "Turns books, ebooks and PDFs into audio files, so you can make your own audiobooks.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/audibily" }],
  //   art: "link",
  // },
  // {
  //   slug: "banham-info",
  //   title: "banham.info",
  //   meta: "Oct 2024",
  //   tech: ["SvelteKit 5", "Tailwind CSS", "Framer Motion", "Vercel"],
  //   summary: "My previous portfolio, built with SvelteKit 5 and Tailwind CSS on Vercel.",
  //   details: [],
  //   links: [
  //     { label: "Live", href: "https://banham-info.vercel.app" },
  //     { label: "Source", href: "https://github.com/wrlliam/banham.info" },
  //   ],
  //   art: "orbit",
  // },
  // {
  //   slug: "college",
  //   title: "College projects",
  //   meta: "2025",
  //   tech: ["TypeScript"],
  //   summary: "All my projects from my final year of college.",
  //   details: [],
  //   links: [{ label: "Source", href: "https://github.com/wrlliam/college" }],
  //   art: "grid",
  // },
];
