import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import MetaPageViewTracker from "@/components/analytics/MetaPageViewTracker";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  const metaPixelId =
    process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "948434710971588";

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sand text-black min-h-screen flex flex-col`}
      >
        <Script
          src="https://connect.facebook.net/en_US/fbevents.js"
          strategy="afterInteractive"
        />
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            window.fbq = window.fbq || function(){(window.fbq.q=window.fbq.q||[]).push(arguments)};
            if (!window._fbq) window._fbq = window.fbq;
            window.fbq.push = window.fbq;
            window.fbq.loaded = true;
            window.fbq.version = '2.0';
            window.fbq.queue = [];
            window.fbq('init', '${metaPixelId}');
          `}
        </Script>
        <MetaPageViewTracker />
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
