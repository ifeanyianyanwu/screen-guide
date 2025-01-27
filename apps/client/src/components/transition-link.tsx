"use client";

import { animatePageOut } from "@/lib/animations";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
}

export const TransitionLink = ({ href, children }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    if (pathname !== href) {
      animatePageOut(href, router);
    }
  };

  return (
    <div
      className="border-0 p-0 m-0 cursor-pointer"
      onClick={handleClick}
      role="link"
      //   title={process.env.BA}
    >
      {children}
    </div>
  );
};
