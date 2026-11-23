"use client";

import { animatePageOut } from "@/lib/animations";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type MouseEvent,
} from "react";

type TransitionLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
> & {
  href: string;
  /**
   * Append a unique `reset` query param on navigation so the page-in
   * animation in `app/template.tsx` replays even when the template isn't
   * remounted (e.g. navigating between two `/movie/[id]` pages).
   */
  reset?: boolean;
};

/**
 * A real `<a href>` (keyboard focusable, middle/ctrl-click to open in a new
 * tab, crawlable) that plays the GSAP page-out animation before navigating on
 * a plain left click.
 *
 * Don't put interactive elements (e.g. `<button>`) inside it; render buttons
 * as `<Button asChild><span>…</span></Button>` instead.
 */
export const TransitionLink = forwardRef<
  HTMLAnchorElement,
  TransitionLinkProps
>(function TransitionLink(
  { href, reset = false, onClick, className, prefetch = false, ...props },
  ref
) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    // Let the browser handle new-tab / new-window / download clicks.
    const isModifiedClick =
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      (props.target !== undefined && props.target !== "_self");
    if (isModifiedClick) return;

    event.preventDefault();

    if (!reset && pathname === href) return;

    const destination = reset
      ? `${href}${href.includes("?") ? "&" : "?"}reset=${Date.now()}`
      : href;
    animatePageOut(destination, router);
  };

  return (
    <Link
      ref={ref}
      href={href}
      prefetch={prefetch}
      onClick={handleClick}
      className={cn("block cursor-pointer", className)}
      {...props}
    />
  );
});
