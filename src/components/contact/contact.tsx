import { profile } from "@/content/profile";
import { ArrowUpRight } from "@/components/ui/icons";
import { ContactActions } from "./contact-actions";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="inverted inverted-wash section"
    >
      <div className="shell">
        <p className="label text-ink-2">Contact</p>
        <h2
          id="contact-title"
          className="display mt-8 max-w-[14ch] text-[clamp(56px,11vw,190px)]"
          data-split
        >
          Let&rsquo;s build something.
        </h2>
        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-2 md:items-end">
          <div>
            <p className="prose-body text-ink-2 text-[clamp(18px,1.4vw,21px)]">
              Got a project, a role or a rack you want to talk about? Drop me a line.
            </p>
            <div className="mt-8">
              <ContactActions />
              <noscript>
                <p className="text-ink-2 mt-4">
                  The email buttons need JavaScript. GitHub and LinkedIn work without it.
                </p>
              </noscript>
            </div>
          </div>
          <ul className="flex flex-col md:items-end">
            {profile.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center gap-3 text-[clamp(24px,2.6vw,40px)] font-semibold tracking-[-0.02em]"
                  data-cursor="link"
                >
                  {l.label}
                  <ArrowUpRight size={26} />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
