import { profile } from "@/content/profile";
import { SoundToggle } from "./sound-toggle";
import { ThemeToggle } from "./theme-toggle";

// Widths pinned to Figtree's metrics so the font swap cannot shift the nav (CLS 0).
export const nav = [
  { id: "work", label: "Work", width: 60 },
  { id: "about", label: "About", width: 66 },
  { id: "experience", label: "Experience", width: 100 },
  { id: "contact", label: "Contact", width: 80 },
] as const;

export function Header() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-40" data-header>
      <div className="shell flex h-[var(--header-h)] items-center justify-between gap-4">
        <a
          href="#top"
          className="wordmark -ml-2 inline-flex min-h-11 items-center px-2 text-[17px] font-semibold tracking-[-0.02em]"
          data-wordmark
          data-cursor="link"
        >
          <span className="hidden sm:inline">{profile.name}</span>
          <span className="sm:hidden" aria-hidden="true">
            {profile.shortName}
          </span>
          <span className="sr-only sm:hidden">{profile.name}</span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 md:flex" data-nav>
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="nav-link relative inline-flex min-h-11 items-center justify-center text-[15px] font-medium whitespace-nowrap"
                  style={{ width: item.width }}
                  data-nav-link={item.id}
                  data-cursor="link"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="nav-link inline-flex min-h-11 w-20 items-center justify-center text-[15px] font-medium whitespace-nowrap md:hidden"
            data-cursor="link"
          >
            Contact
          </a>
          <SoundToggle />
          <ThemeToggle />
        </nav>
      </div>
      <div className="scroll-progress" data-scroll-progress aria-hidden="true" />
    </header>
  );
}
