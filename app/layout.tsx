import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeInitializer from "@/components/ThemeInitializer";
import "./globals.css";

const inter = Inter({
  variable: "--font-display",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "CODEX — Design Archive",
    template: "%s — CODEX",
  },
  description:
    "An independent digital archive exploring identity, interaction, and motion.",
  applicationName: "CODEX",
  keywords: [
    "creative development",
    "web design",
    "interaction design",
    "digital art direction",
    "motion design",
    "portfolio",
  ],
  authors: [{ name: "CODEX" }],
  creator: "CODEX",
  category: "Design",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CODEX",
    title: "CODEX — Design Archive",
    description:
      "An independent digital archive exploring identity, interaction, and motion.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CODEX — Design Archive",
    description:
      "An independent digital archive exploring identity, interaction, and motion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <a className="skipLink" href="#main-content">
          Skip to content
        </a>
        <ThemeInitializer />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
