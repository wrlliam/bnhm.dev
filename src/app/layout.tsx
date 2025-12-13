import type { Metadata } from "next";
import "@/styles/globals.css";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://bnhm.dev"),

  title: {
    default: "William Banham - Full-stack Developer, Infra & Network Engineer",
    template: "%s | William Banham",
  },

  description:
    "A Full-stack, Infra & Networking Engineer. Available for freelance projects and consulting.",

  keywords: [
    "William Banham",
    "Full-stack Developer",
    "Infrastructure Engineer",
    "Network Engineer",
    "Software Development",
    "DevOps",
    "Web Development",
    "React Developer",
    "Node.js Developer",
    "Cloud Infrastructure",
    "AWS",
    "Docker",
    "Kubernetes",
    "TypeScript",
    "JavaScript",
    "Next.js",
    "System Administration",
    "Network Security",
    "Database Design",
    "API Development",
    "Microservices",
    "CI/CD",
    "Freelance Developer",
    "Technical Consultant",
    "UK Developer",
  ],

  authors: [{ name: "William Banham", url: "https://bnhm.dev" }],
  creator: "William Banham",
  publisher: "William Banham",

  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://bnhm.dev",
    siteName: "William Banham",
    title: "William Banham",
    description:
      "A Full-stack, Infra & Networking Engineer. Available for freelance projects and consulting.",
    images: [
      {
        url: "/banner.png",
        width: 1584,
        height: 396,
        alt: "William Banham - Full-stack Developer, Infrastructure & Network Engineer",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@wbnhm",
    creator: "@wbnhm",
    title: "William Banham - Full-stack Developer & Infrastructure Engineer",
    description:
      "Skilled full-stack developer and infrastructure engineer. Specializing in modern web development, DevOps, and network engineering.",
    images: ["/banner.png"],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "Technology",
  classification: "Professional Portfolio",

  applicationName: "William Banham Portfolio",
  referrer: "origin-when-cross-origin",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Other metadata
  other: {
    "contact:email": "will@bnhm.dev", // Replace with your actual email
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "profile:first_name": "William",
    "profile:last_name": "Banham",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <meta name="theme-color" content="#155dfc" />
        <meta name="msapplication-TileColor" content="#155dfc" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body className={`antialiased`}>
        <Cursor />
        <Loader>{children}</Loader>
        <Script
          src="https://analytics.bnhm.systems/api/script.js"
          data-site-id="2c0a05deb069"
          defer
        />
      </body>
    </html>
  );
}
