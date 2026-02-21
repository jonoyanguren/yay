"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackMeta } from "@/lib/meta-pixel";

export default function MetaPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackMeta("PageView", {
      page_path: pagePath,
      page_url: window.location.href,
    });
  }, [pathname, query]);

  return null;
}
