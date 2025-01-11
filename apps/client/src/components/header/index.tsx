"use client";

import { ReactNode } from "react";
import { Search, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { useScrolled } from "@/hooks/use-scrolled";
import { NavItems } from "./nav-items";
import { IconButton } from "./icon-button";

const LOGO_WIDTH = {
  scrolled: "w-24",
  default: "w-28",
};

export function Header({ children }: { children: ReactNode }) {
  const scrolled = useScrolled();
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "rounded-lg fixed top-2.5 left-2.5 right-2.5 z-50 transition-all duration-300 ease-in-out backdrop-blur-lg",
        scrolled ? "h-16 bg-background/10" : "h-20 bg-background/20"
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link
            className={cn(
              "transition-all duration-300 ease-in-out",
              scrolled ? LOGO_WIDTH.scrolled : LOGO_WIDTH.default,
              pathname === "/" && "text-primary underline"
            )}
            href="/"
          >
            <Image
              src="/assets/logo.png"
              height={200}
              width={200}
              alt="Logo"
              className="w-full"
            />
          </Link>
        </div>
        <NavItems />
        <div className="flex items-center space-x-4">
          <IconButton href="/search" icon={Search} label="Search" />
          <IconButton href="/watch-list" icon={Heart} label="Watch List" />
          {children}
          <Sidebar />
        </div>
      </div>
    </header>
  );
}
