import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const sansFont = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const interFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "COMET AGENT",
  description:
    "An AI Operating System for Startup Creation. Orchestrate specialized AI agents or use them independently.",
};

import { Agentation } from "agentation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sansFont.variable} ${interFont.variable}`}>
      <body className="min-h-screen bg-background text-text-primary antialiased flex flex-col relative overflow-x-hidden font-sans">
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
