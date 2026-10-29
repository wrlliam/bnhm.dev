export type StackGroup = { name: string; items: string[] };

export const stack: StackGroup[] = [
  {
    name: "Software",
    items: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "NestJS",
      "Tailwind CSS",
      "HTML/CSS",
      "Python",
      "Go",
      "Node.js",
      "GraphQL",
      "REST APIs",
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "Drizzle ORM",
    ],
  },
  {
    name: "Infrastructure",
    items: [
      "Proxmox",
      "Docker",
      "Kubernetes",
      "Linux",
      "CLI",
      "Networking",
      "Virtual machines",
      "CI/CD (Forgejo Actions)",
    ],
  },
  { name: "Also", items: ["3D printing", "CAD design"] },
];

/** Generic, public-safe rack units. No service names, hosts or addresses. */
export const rackUnits = [
  { id: "edge", label: "Edge", role: "Reverse proxies and the way in" },
  { id: "network", label: "Network", role: "Switching, mesh VPN and DNS filtering" },
  { id: "compute-1", label: "Compute", role: "Proxmox host: VMs and containers" },
  { id: "compute-2", label: "Compute", role: "Self-hosted PaaS and game servers" },
  { id: "storage", label: "Storage", role: "Backups and media" },
  { id: "ops", label: "Monitoring", role: "Metrics, alerts and SSO" },
] as const;
