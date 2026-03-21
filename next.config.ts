import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita que Turbopack incruste una copia vieja de Prisma tras `prisma generate`
  // (síntoma: Unknown argument balanceInvoiceSentAt en runtime).
  serverExternalPackages: ["@prisma/client"],
  images: {
    // Evita timeout en dev al optimizar imágenes externas (Cloudinary)
    unoptimized: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
