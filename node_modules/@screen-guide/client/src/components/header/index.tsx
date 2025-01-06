"use client";

import { useState, useEffect, ReactNode } from "react";
import { Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";

export const navItems = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movie" },
  { name: "Tv", href: "/tv" },
];

export function Header({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header
      className={`rounded-lg fixed top-2.5 left-2.5 right-2.5 z-50 transition-all duration-300 ease-in-out backdrop-blur-lg ${
        scrolled ? "h-16 bg-background/10" : "h-20 bg-background/20"
      }`}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <Link
            className={cn(
              `transition-all duration-300 ease-in-out`,
              scrolled ? "w-24" : "w-28",
              pathname === "/" && "text-primary underline"
            )}
            href="/"
          >
            <Image
              src={"/assets/logo.png"}
              height={200}
              width={200}
              alt="Logo"
              className="w-full"
            />
          </Link>
        </div>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.name} className="overflow-hidden rounded-md p-1.5">
                <Link
                  href={item.href}
                  className={cn("text-foreground relative group")}
                >
                  <span
                    className={cn(
                      "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 group-hover:w-[300px] group-hover:h-[300px] backdrop-blur-lg bg-foreground/20 rounded-full transition-all duration-300 ease-in",
                      pathname === item.href && "h-[300px] w-[300px]"
                    )}
                  />
                  <span className="relative z-10 flex gap-x-2 text-sm items-center ease-in font-semibold hover:scale-105 transition-transform duration-300">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
          <Link href="/watch-list">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Watch List</span>
            </Button>
          </Link>
          {children}
          <Sidebar />
        </div>
      </div>
    </header>
  );
}
