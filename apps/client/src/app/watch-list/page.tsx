import { getWatchList } from "@/api/server";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/actions";
import { appConfig } from "@/lib/config";
import { FilmIcon, UserPlus, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RemoveFromWatchlist } from "./_components/remove-from-watchlist";

export default async function WatchList() {
  const session = await getSession();

  if (!session.isValid) return <LoggedOutState />;

  const watchList = await getWatchList(session.session);

  return (
    <div className="w-full max-w-4xl mx-auto pt-32 md:pt-36 space-y-8">
      <header>
        <h1 className="hidden md:inline-block text-center text-2xl font-bold w-full">
          Watch List
        </h1>
      </header>
      <main className="space-y-6 px-4">
        {watchList.data.items.length === 0 ? (
          <EmptyWatchList />
        ) : (
          watchList.data.items.map((item) => {
            const imageUrl = `${appConfig.imageBaseURL}${item.imageUrl}`;
            return (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 hover:bg-gray-900/70 transition-colors"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-white truncate">
                    {item.name}
                  </h3>
                  {item.type === "movie" ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{item.rating.toFixed(2)}</span>
                      <span>•</span>
                      <span>{item.releaseDate}</span>
                      <span>•</span>
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span>{item.duration}&nbsp;mins</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>{item.rating.toFixed(2)}</span>
                      <span>•</span>
                      <span>{item.releaseDate}</span>
                      <span>•</span>
                      <span className="capitalize">{item.type}</span>
                    </div>
                  )}
                </div>
                <RemoveFromWatchlist session={session.session} id={item._id} />
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}

function EmptyWatchList() {
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
