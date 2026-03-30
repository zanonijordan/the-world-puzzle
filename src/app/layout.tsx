import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/site-header";
import { auth } from "@/lib/auth";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THE WORLD PUZZLE",
  description:
    "Blog cyberpunk sobre histórias ocultas, jornalismo investigativo, análise de filmes e filosofia.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;

  try {
    session = await auth();
  } catch (error) {
    console.warn("[RootLayout] Failed to resolve session via auth()", error);
    session = null;
  }

  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SiteHeader session={session} />
        {children}
      </body>
    </html>
  );
}
