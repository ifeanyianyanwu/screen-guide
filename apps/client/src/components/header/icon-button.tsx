"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface IconButtonProps {
  href?: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function IconButton({
  href,
  icon: Icon,
  label,
  onClick,
  className,
}: IconButtonProps) {
  const pathname = usePathname();

  const buttonContent = (
    <>
      <span
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 group-hover:w-[300px] group-hover:h-[300px] backdrop-blur-lg bg-foreground/20 rounded-full transition-all duration-300 ease-in",
          href && pathname === href && "h-[300px] w-[300px]"
        )}
      />
      <Icon className="h-5 w-5 relative z-10 flex gap-x-2 text-sm items-center ease-in font-semibold hover:scale-105 transition-transform duration-300" />
      <span className="sr-only">{label}</span>
    </>
  );

  const buttonProps = {
    variant: "ghost" as const,
    size: "icon" as const,
    className: cn(
      "overflow-hidden group relative hover:bg-transparent",
      className
    ),
    onClick,
  };

  if (href) {
    return (
      <Link href={href}>
        <Button {...buttonProps} title={label}>
          {buttonContent}
        </Button>
      </Link>
    );
  }

  return (
    <Button {...buttonProps} title={label}>
      {buttonContent}
    </Button>
  );
}
