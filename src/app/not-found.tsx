import type { Metadata } from "next";
import { ArrowUpRight } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Not found · William Banham",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="shell flex min-h-[100svh] flex-col justify-center py-24">
      <p className="label tabular text-ink-2">404 / Not found</p>
      <h1 className="display mt-8 max-w-[12ch] text-[clamp(56px,11vw,180px)]">
        Nothing on this port.
      </h1>
      <p className="prose-body text-ink-2 mt-8">
        The page you were after isn&rsquo;t here, or never was. The rest of the site is
        exactly where I left it.
      </p>
      <p className="mt-10">
        {/* Plain link on purpose: a full load from the 404 needs no client router. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="btn btn-ghost">
          Back to the start
          <ArrowUpRight size={18} />
        </a>
      </p>
    </main>
  );
}
