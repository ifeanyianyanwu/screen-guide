import { Button } from "@/components/ui/button";
import { FilmIcon, PlusCircle } from "lucide-react";
import Link from "next/link";

export function EmptyWatchList() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
      <FilmIcon className="h-24 w-24 text-gray-400" />
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Your watch list is empty
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Start adding movies and TV shows to your watch list to keep track of
          what you want to watch.
        </p>
      </div>
      <Button asChild className="mt-4">
        <Link href="/search">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Watch List
        </Link>
      </Button>
    </div>
  );
}
