"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackAnalytics } from "@/lib/analytics";

export default function MetaPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackAnalytics("PageView", {
      page_path: pagePath,
      page_url: window.location.href,
    });
  }, [pathname, query]);

  return null;
}
