import type { Metadata } from "next";
import { Cairo, Amiri, Tajawal, IBM_Plex_Sans_Arabic } from "next/font/google";
import { FontProvider } from "@/components/providers/FontProvider";
import { BackgroundImage } from "@/components/background/BackgroundImage";
import "./globals.css";

// Cairo - Modern geometric Arabic font (sans-serif)
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

// Amiri - Traditional Naskh-style Arabic font (serif)
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: true,
});

// Tajawal - Modern Arabic font (sans-serif)
const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: true,
});

// IBM Plex Sans Arabic - Clean, modern Arabic font (sans-serif)
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "مسجد الهدى - Al-Houda Mosque",
  description: "شاشة عرض المسجد - Prayer times and information display",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${amiri.variable} ${tajawal.variable} ${ibmPlexSansArabic.variable} font-cairo antialiased bg-dark-222`}>
        <BackgroundImage />
        <FontProvider>{children}</FontProvider>
      </body>
    </html>
  );
}
