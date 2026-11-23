"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { TransitionLink } from "../transition-link";

interface IconButtonProps {
  href: string;
  icon: LucideIcon;
  label: string;
  reset?: boolean;
  className?: string;
}

// An icon-only link styled as a ghost icon button.
export function IconButton({
  href,
  icon: Icon,
  label,
  reset,
  className,
}: IconButtonProps) {
  const pathname = usePathname();

  return (
    <TransitionLink href={href} reset={reset} title={label}>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className={cn(
          "overflow-hidden group relative hover:bg-transparent",
          className
        )}
      >
        <span>
          <span
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 group-hover:w-[300px] group-hover:h-[300px] backdrop-blur-lg bg-foreground/20 rounded-full transition-all duration-300 ease-in",
              pathname === href && "h-[300px] w-[300px]"
            )}
          />
          <Icon className="h-5 w-5 relative z-10 flex gap-x-2 text-sm items-center ease-in font-semibold hover:scale-105 transition-transform duration-300" />
          <span className="sr-only">{label}</span>
        </span>
      </Button>
    </TransitionLink>
  );
}
