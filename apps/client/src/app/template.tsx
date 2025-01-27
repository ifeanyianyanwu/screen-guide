"use client";

import { animatePageIn } from "@/lib/animations";
import { ReactNode, useEffect } from "react";

export default function Template({ children }: { children: ReactNode }) {
  useEffect(() => {
    animatePageIn();
  }, []);

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
