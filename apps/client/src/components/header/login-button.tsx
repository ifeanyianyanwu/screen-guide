"use client";

import { User } from "lucide-react";
import { IconButton } from "./icon-button";
import { TransitionLink } from "../transition-link";

export const LoginButton = () => (
  <TransitionLink href="/signin">
    <IconButton href="/signin" label="Signin" icon={User} />
  </TransitionLink>
);
