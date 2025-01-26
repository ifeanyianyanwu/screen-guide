import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const navItems = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movie" },
  { name: "Tv Shows", href: "/tv" },
];

export function NavItems() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:block">
      <ul className="flex space-x-4">
        {navItems.map((item) => (
          <li key={item.name} className="overflow-hidden rounded-md p-1.5">
            <Link
              href={item.href}
              className={cn("text-foreground relative group")}
            >
              <span
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 group-hover:w-[300px] group-hover:h-[300px] backdrop-blur-lg bg-foreground/20 rounded-full transition-all duration-300 ease-in",
                  pathname === item.href && "h-[300px] w-[300px]"
                )}
              />
              <span className="relative z-10 flex gap-x-2 text-sm items-center ease-in font-semibold hover:scale-105 transition-transform duration-300">
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
