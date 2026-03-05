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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "YaY Retreats | Retiros bienestar y retiros yoga",
    template: "%s | YaY Retreats",
  },
  description:
    "Retiros bienestar y retiros yoga para desconectar del estrés digital. Bienestar práctico, descanso real y experiencias en grupo.",
  keywords: [
    "retiros bienestar",
    "retiros yoga",
    "retiros desconexion",
    "retiros de bienestar en espana",
    "retiros para desconectar",
    "yoga y bienestar",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "YaY Retreats | Retiros bienestar y retiros yoga",
    description:
      "Retiros bienestar y retiros yoga para desconectar del estrés digital con un enfoque práctico y sin postureo.",
    url: "/",
    siteName: "YaY Retreats",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YaY Retreats | Retiros bienestar y retiros yoga",
    description:
      "Retiros modernos para descansar, moverte y volver con energía. Bienestar práctico y desconexión real.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

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
        {gtmId ? (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        ) : null}
        <Suspense fallback={null}>
          <MetaPageViewTracker />
        </Suspense>
        {gtmId ? (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        ) : (
          <>
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
          </>
        )}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
