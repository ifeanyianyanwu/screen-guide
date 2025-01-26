import { Button } from "@/components/ui/button";
import { FilmIcon, UserPlus } from "lucide-react";
import Link from "next/link";

export function LoggedOutState() {
  return (
    <div className="container mx-auto px-4 py-28 md:py-36 space-y-14">
      <header>
        <h1 className="hidden md:inline-block text-center text-3xl font-semibold w-full">
          Watch List
        </h1>
      </header>
      <div className="w-full max-w-md text-center space-y-8 md:space-y-14 mx-auto">
        <div className="mx-auto w-24 h-24 flex items-center justify-center">
          <FilmIcon className="size-28 md:size-40 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Your Watch List Awaits!
          </h1>
          <p className="mx-auto max-w-md text-muted-foreground">
            Sign in or create an account to start building your personalized
            movie collection.
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full" size="lg">
            <Link href="/signin">Sign In</Link>
          </Button>
          <Button asChild variant="outline" className="w-full" size="lg">
            <Link href="/signup">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
