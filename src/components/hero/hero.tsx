import { profile } from "@/content/profile";
import { Clock } from "@/components/ui/clock";
import { ArrowDown } from "@/components/ui/icons";

export function Hero() {
  const [first, last] = profile.name.split(" ");
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="hero shell relative flex min-h-[100svh] flex-col justify-end pt-[calc(var(--header-h)+48px)] pb-10 md:pb-14"
      data-hero
    >
      <div className="grid-12 items-end gap-y-10">
        <div className="col-span-12">
          <p className="chip mb-8 w-fit md:mb-10" data-hero-chip>
            <span className="bg-decor size-1.5 rounded-full" aria-hidden="true" />
            {profile.chip}
          </p>
          <h1
            id="hero-title"
            className="display text-[clamp(64px,15.5vw,260px)]"
            data-hero-title
            aria-label={profile.name}
          >
            <span className="block" data-hero-line aria-hidden="true">
              {first}
            </span>
            <span className="block" data-hero-line aria-hidden="true">
              {last}
            </span>
          </h1>
        </div>

        <div className="col-span-12 md:col-span-7 lg:col-span-6">
          <p
            className="text-[clamp(22px,2.4vw,34px)] leading-[1.2] font-medium tracking-[-0.02em] text-balance"
            data-hero-fade
          >
            {profile.tagline}
          </p>
        </div>
        <div
          className="text-ink-2 col-span-12 flex flex-col gap-1 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9"
          data-hero-fade
        >
          <p className="text-ink font-medium">{profile.role}</p>
          <p>{profile.supporting}</p>
        </div>
      </div>

      <div
        className="border-rule mt-12 flex items-center justify-between border-t pt-5 text-[15px] md:mt-16"
        data-hero-fade
      >
        <Clock className="text-ink-2" />
        <a
          href="#about"
          className="inline-flex min-h-11 items-center gap-2 font-medium"
          data-cursor="link"
        >
          Scroll
          <ArrowDown size={18} className="scroll-cue" />
        </a>
      </div>
    </section>
  );
}
