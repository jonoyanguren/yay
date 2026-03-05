import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Retiros bienestar y retiros yoga",
  description:
    "Contacta con YaY Retreats para resolver dudas sobre nuestros retiros bienestar y retiros yoga o para organizar una experiencia privada.",
  keywords: [
    "contacto retiros bienestar",
    "contacto retiros yoga",
    "informacion retiro",
    "yay retreats contacto",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
