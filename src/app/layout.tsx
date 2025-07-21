import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";

export const metadata: Metadata = {
  title: "William Banham",
  description: "Full-stack Developer, Infra & Network Engineer.",
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
