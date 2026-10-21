import type { Metadata, Viewport } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tablemate — Good taste doesn't retire.",
    template: "%s · Tablemate",
  },
  description:
    "A short, honest restaurant shortlist for older adults and the people who care for them. Taste signals from Qloo, needs labeled reported, likely, or ask.",
  applicationName: "Tablemate",
  keywords: [
    "caregiver",
    "seniors",
    "restaurant shortlist",
    "dysphagia",
    "Qloo",
    "accessible dining",
  ],
  openGraph: {
    title: "Tablemate — Good taste doesn't retire.",
    description:
      "A short, honest restaurant shortlist shaped by what someone loves and how they eat.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF7F0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
