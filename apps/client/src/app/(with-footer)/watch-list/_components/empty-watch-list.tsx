import { TransitionLink } from "@/components/transition-link";
import { Button } from "@/components/ui/button";
import { FilmIcon, PlusCircle } from "lucide-react";

export function EmptyWatchList() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 md:space-y-14 max-w-md mx-auto">
      <FilmIcon className="size-28 md:size-40 text-gray-400" />
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">
          Your watch list is empty
        </h2>
        <p className="mx-auto max-w-md text-muted-foreground">
          Start adding movies and TV shows to your watch list to keep track of
          what you want to watch.
        </p>
      </div>
      <Button asChild className="mt-4 w-full" size="lg">
        <TransitionLink href={"/search" + `?reset=${Date.now()}`}>
          <PlusCircle className="mr-2 h-10 w-10" />
          Add to Watch List
        </TransitionLink>
      </Button>
    </div>
  );
}
