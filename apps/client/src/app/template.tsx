"use client";

import { animatePageIn, preloadPageAnimations } from "@/lib/animations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CSSProperties, ReactNode, useEffect } from "react";

const BANNERS = [
  "left-0",
  "left-1/4",
  "left-2/4",
  "left-3/4",
] as const;

export default function Template({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resetParam = searchParams.get("reset");

  // The page-in reveal on mount is pure CSS (`.page-banner`), so it starts on
  // first paint instead of after hydration. Fetch GSAP in the background for
  // the page-out animation on the next click.
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preloadPageAnimations);
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(preloadPageAnimations, 2000);
    return () => clearTimeout(id);
  }, []);

  // Handle animation reset triggered by server components
  useEffect(() => {
    if (resetParam) {
      void animatePageIn();

      // Clean up URL parameters after reset
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("reset"); // Remove reset trigger

      // Update URL without adding to browser history
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [resetParam, router, pathname, searchParams]);

  return (
    <div>
      {BANNERS.map((left, index) => (
        <div
          key={left}
          id={`banner-${index + 1}`}
          aria-hidden
          className={`page-banner min-h-screen bg-primary z-50 fixed top-0 ${left} w-1/4`}
          style={{ "--banner-index": index } as CSSProperties}
        />
      ))}
      {children}
    </div>
  );
}
