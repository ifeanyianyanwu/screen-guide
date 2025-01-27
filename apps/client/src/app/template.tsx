"use client";

import { animatePageIn } from "@/lib/animations";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const resetParam = searchParams.get("reset");

  useEffect(() => {
    animatePageIn();
  }, []);

  // Handle animation reset triggered by server components
  useEffect(() => {
    if (resetParam) {
      animatePageIn();

      // Clean up URL parameters after reset
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("reset"); // Remove reset trigger

      // Update URL without adding to browser history
      router.replace(`${pathname}?${newParams.toString()}`);
    }
  }, [resetParam, router, pathname, searchParams]);

  return (
    <div>
      <div
        className="min-h-screen bg-primary z-50 fixed top-0 left-0 w-1/4"
        id="banner-1"
      />
      <div
        className="min-h-screen bg-primary z-50 fixed top-0 left-1/4 w-1/4"
        id="banner-2"
      />
      <div
        className="min-h-screen bg-primary z-50 fixed top-0 left-2/4 w-1/4"
        id="banner-3"
      />
      <div
        className="min-h-screen bg-primary z-50 fixed top-0 left-3/4 w-1/4"
        id="banner-4"
      />
      {children}
    </div>
  );
}
