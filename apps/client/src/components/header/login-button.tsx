"use client";

import { User } from "lucide-react";
import { IconButton } from "./icon-button";

export const LoginButton = () => (
  <IconButton href="/signin" label="User account" icon={User} />
);
