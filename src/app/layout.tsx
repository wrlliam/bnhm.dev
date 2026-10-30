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
 * Runs before paint:
 * - marks JS as available (hide-for-animation styles only apply with scripts),
 *   restores the theme and flags returning visitors so the gate is skipped;
 * - gate progress: window.bnhmStep marks real loading steps (fonts, page,
 *   motion, sound). The counter is one continuous ease-in-out run (Web
 *   Animations on --gate-p of the number and bar, no JS loop) that holds near the end until every
 *   step is done, then eases out to 100 and fires "bnhm:gate-done";
 * - gate text waits for Figtree itself (max 2.5 s) so the swap cannot shift it;
 * - if the motion runtime never arrives, the gate steps aside after 6 s.
 */
const bootScript = `(function(){
var d=document.documentElement;d.classList.add('js');
var n=0,anims=[],held=false,done=false;
function finish(){if(done)return;done=true;d.classList.add('gs-done');window.dispatchEvent(new Event('bnhm:gate-done'))}
window.bnhmStep=function(k){if(d.classList.contains('gs-'+k))return;d.classList.add('gs-'+k);n++;d.dataset.gs=String(n);if(n>=4){if(anims.length){if(held)anims.forEach(function(a){a.play()})}else setTimeout(finish,250)}};
try{var t=localStorage.getItem('bnhm:theme');if(t==='dark'||t==='light')d.dataset.theme=t;if(sessionStorage.getItem('bnhm:entered'))d.classList.add('entered')}catch(e){d.classList.add('entered')}
var f=function(){d.classList.add('fonts')};
if(document.fonts&&document.fonts.load){document.fonts.load('400 1em Figtree').then(function(){f();bnhmStep('fonts')},function(){f();bnhmStep('fonts')})}else{f();bnhmStep('fonts')}
setTimeout(f,2500);
document.addEventListener('DOMContentLoaded',function(){
bnhmStep('page');
var g=document.querySelector('[data-gate]');
var calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!g||d.classList.contains('entered')||calm||!g.animate)return;
var D=1700;
var els=g.querySelectorAll('[data-gate-p]');
try{for(var i=0;i<els.length;i++)anims.push(els[i].animate({'--gate-p':[0,100]},{duration:D,easing:'cubic-bezier(0.65,0,0.35,1)',fill:'forwards'}))}catch(e){anims=[];return}
setTimeout(function(){if(n<4&&anims.length){anims.forEach(function(a){a.pause()});held=true}},D*0.74);
anims[0].finished.then(finish,finish);
});
setTimeout(function(){if(!d.classList.contains('motion-ready'))d.classList.add('entered')},6000);
})()`.replace(/\n/g, "");

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
