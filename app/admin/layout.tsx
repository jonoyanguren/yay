"use client";

import { usePathname } from "next/navigation";
import AuthCheck from "./components/AuthCheck";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't apply AuthCheck on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }
  
  return <AuthCheck>{children}</AuthCheck>;
}
