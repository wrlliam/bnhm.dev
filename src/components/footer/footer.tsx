import { profile } from "@/content/profile";
import { Clock } from "@/components/ui/clock";
import { ArrowUp } from "@/components/ui/icons";
import { SoundToggle } from "@/components/header/sound-toggle";

export function Footer() {
  return (
    <footer className="inverted border-rule border-t">
      <div className="shell grid gap-6 py-10 text-[15px] sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
        <div className="flex flex-col gap-1">
          <Clock />
          <span className="text-ink-2">
            {profile.location} <span aria-hidden="true">· {profile.coords}</span>
          </span>
        </div>
        <p className="text-ink-2 lg:text-center">Designed and built by {profile.name}</p>
        <p className="text-ink-2 lg:text-center">© 2026 {profile.name}</p>
        <div className="flex items-center gap-2 sm:justify-end">
          <SoundToggle className="hover:bg-navy-700" />
          <a
            href="#top"
            className="hover:bg-navy-700 inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-medium"
            data-cursor="link"
          >
            Back to top
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
      <div className="shell pb-8">
        <p className="ai-note text-[12px] leading-snug">
          This site was built with the help of AI.
        </p>
      </div>
    </footer>
  );
}
