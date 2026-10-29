import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { profile, seo } from "@/content/profile";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: "variable", // one variable file; CSS uses 300–800 only
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: seo.title,
  description: seo.description,
  alternates: { canonical: "/" },
  authors: [{ name: profile.name, url: profile.site }],
  creator: profile.name,
  formatDetection: { email: false, telephone: false, address: false },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.name,
    title: seo.title,
    description: seo.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F3F7F9" },
    { media: "(prefers-color-scheme: dark)", color: "#071A2B" },
  ],
};

/**
 * Runs before paint: marks JS as available (so hide-for-animation styles only
 * apply when scripts run), restores the theme choice, and flags returning
 * visitors so the gate can be skipped. If the motion runtime never arrives,
 * the gate steps aside after 6 s.
 */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('bnhm:theme');if(t==='dark'||t==='light')d.dataset.theme=t;if(sessionStorage.getItem('bnhm:entered'))d.classList.add('entered')}catch(e){d.classList.add('entered')}setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.add('entered')},6000)})()`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Full-stack developer, infrastructure & network engineer",
  url: profile.site,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Derbyshire",
    addressCountry: "GB",
  },
  sameAs: profile.links.map((l) => l.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={figtree.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
