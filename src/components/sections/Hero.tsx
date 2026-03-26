"use client";

import Link from "@/components/Link";
import { SOCIAL_LINKS } from "@/lib/data";

export default function Hero() {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-4xl font-semibold">William Banham</h1>

      <p className="text-[15px] text-neutral-500 leading-relaxed">
        Full-stack developer, infrastructure &amp; network engineer.
      </p>

      <div className="flex gap-3 mt-1">
        {SOCIAL_LINKS.map((link) => (
          <Link key={link.label} url={link.url} side="bottom">
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
