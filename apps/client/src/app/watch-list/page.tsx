import { LoggedOutState } from "./_components/loggedout-state";
import { EmptyWatchList } from "./_components/empty-watch-list";
import { getWatchList } from "@/api/server";
import { getSession } from "@/lib/actions";
import { appConfig } from "@/lib/config";
import Image from "next/image";
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
