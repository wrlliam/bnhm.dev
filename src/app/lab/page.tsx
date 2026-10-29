import type { Metadata } from "next";
import { SoundLab } from "./sound-lab";

export const metadata: Metadata = {
  title: "Sound lab",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function LabPage() {
  return (
    <main id="main" className="shell section">
      <p className="label text-ink-2">Unlisted</p>
      <h1 className="display mt-6 text-[clamp(48px,8vw,120px)]">Sound lab</h1>
      <p className="prose-body text-ink-2 mt-6">
        Every interface sound, synthesised live with the Web Audio API. Tune by ear;
        values apply to the whole palette until you reload.
      </p>
      <SoundLab />
    </main>
  );
}
