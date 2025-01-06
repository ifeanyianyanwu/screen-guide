"use client";

import { logout } from "@/lib/actions";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export const LogoutButton = () => {
  return <DropdownMenuItem onClick={() => logout()}>Logout</DropdownMenuItem>;
};
