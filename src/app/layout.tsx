import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";

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
    siteName: "William Banham - Developer Portfolio",
    title: "William Banham - Full-stack Developer & Infrastructure Engineer",
    description:
      "William Banham is a skilled full-stack developer and infrastructure engineer specializing in modern web development, DevOps, and network engineering. Available for freelance projects and consulting.",
    images: [
      {
        url: "/banner.png",
        width: 1584,
        height: 396,
        alt: "William Banham - Full-stack Developer, Infrastructure & Network Engineer",
        type: "image/png",
      },
      {
        url: "/logo.png", // Alternative square format
        width: 500,
        height: 500,
        alt: "William Banham - Developer Portfolio",
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
      <body className={`antialiased`}>
        <Cursor />
        <Loader>{children}</Loader>
      </body>
    </html>
  );
}
