import type { Metadata } from "next";
import {
  Alegreya,
  Caveat,
  Geist_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import MetaPageViewTracker from "@/components/analytics/MetaPageViewTracker";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const alegreya = Alegreya({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "YaY Retreats | Modern Disconnect",
  description:
    "Retiros modernos de desconexión. Sin misticismo, solo bienestar práctico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${plusJakartaSans.className} ${plusJakartaSans.variable} ${geistMono.variable} ${caveat.variable} antialiased bg-sand text-black min-h-screen flex flex-col`}
        style={
          {
            "--font-title-family": alegreya.style.fontFamily,
          } as React.CSSProperties
        }
      >
        <Suspense fallback={null}>
          <MetaPageViewTracker />
        </Suspense>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FJ6KL0M75M"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-FJ6KL0M75M');
          `}
        </Script>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
