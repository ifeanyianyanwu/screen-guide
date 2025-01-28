"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { navItems } from "./nav-items";
import { TransitionLink } from "../transition-link";

export const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full bg-background/70 backdrop-blur-lg"
      >
        <nav className="flex flex-col h-full justify-center items-center">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <TransitionLink href={item.href + `?reset=${Date.now()}`}>
                  <p
                    className="text-foreground hover:text-primary block py-2 text-center text-lg font-medium"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {item.name}
                  </p>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
