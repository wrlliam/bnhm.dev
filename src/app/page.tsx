import { profile } from "@/content/profile";

export default function Home() {
  return (
    <main id="main" className="shell section">
      <p className="label text-ink-2">Portfolio</p>
      <h1 className="display mt-6 text-[clamp(56px,12vw,200px)]">{profile.name}</h1>
      <p className="prose-body mt-6">{profile.role}</p>
    </main>
  );
}
