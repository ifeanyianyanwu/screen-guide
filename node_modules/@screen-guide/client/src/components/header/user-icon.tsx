import { getSession } from "@/lib/actions";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "./logout-button";

export async function UserIcon() {
  const session = await getSession();

  if (session.isValid) return <LogoutButton />;

  if (!session.isValid)
    return (
      <Link href="/signin">
        <Button variant="ghost" size="icon" title="Signin/Signup">
          <User className="h-5 w-5" />
          <span className="sr-only">User account</span>
        </Button>
      </Link>
    );
}
