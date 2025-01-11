"use client";

import { logout } from "@/lib/actions";

import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export const LogoutButton = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="Signout"
      onClick={() => logout()}
      className="overflow-hidden group relative hover:bg-transparent"
    >
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 group-hover:w-[300px] group-hover:h-[300px] backdrop-blur-lg bg-foreground/20 rounded-full transition-all duration-300 ease-in" />
      <LogOut className="h-5 w-5 relative z-10 flex gap-x-2 text-sm items-center ease-in font-semibold hover:scale-105 transition-transform duration-300" />
      <span className="sr-only">Sign out</span>
    </Button>
  );
};
