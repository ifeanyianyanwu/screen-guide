import { getSession } from "@/lib/actions";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export async function UserIcon() {
  const session = await getSession();

  if (session)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <LogoutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    );

  if (!session)
    return (
      <Link href="/signin">
        <Button variant="ghost" size="icon" title="Signin/Signup">
          <User className="h-5 w-5" />
          <span className="sr-only">User account</span>
        </Button>
      </Link>
    );
}
