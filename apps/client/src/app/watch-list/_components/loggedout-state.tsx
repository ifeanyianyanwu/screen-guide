import { Button } from "@/components/ui/button";
import { FilmIcon, UserPlus } from "lucide-react";
import Link from "next/link";

export function LoggedOutState() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Your Watch List Awaits!
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Sign in or create an account to start building your personalized
            movie collection.
          </p>
        </div>
        <div className="mx-auto w-24 h-24 flex items-center justify-center">
          <FilmIcon className="h-16 w-16 text-primary" />
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
