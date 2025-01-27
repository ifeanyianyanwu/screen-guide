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
import { TransitionLink } from "../transition-link";

export function Header({ children }: { children: ReactNode }) {
  const scrolled = useScrolled();
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "rounded-lg fixed top-2.5 left-2.5 right-2.5 z-50 transition-all duration-300 ease-in-out backdrop-blur-lg h-16",
        scrolled ? "bg-background/10" : "bg-background/20"
      )}
    >
      <div className="container mx-auto px-2 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link
            className={cn(
              "transition-all duration-300 ease-in-out w-24",
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
          <TransitionLink href="/search">
            <IconButton icon={Search} label="Search" href="/search" />
          </TransitionLink>
          <TransitionLink href="/watch-list">
            <IconButton href="/watch-list" icon={Heart} label="Watchlist" />
          </TransitionLink>
          {children}
          <Sidebar />
        </div>
      </div>
    </header>
  );
}
