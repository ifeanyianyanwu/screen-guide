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
    >
      <LogOut className="h-5 w-5" />
      <span className="sr-only">User account</span>
    </Button>
  );
};
