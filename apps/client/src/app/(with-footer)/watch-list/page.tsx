import { LoggedOutState } from "./_components/logged-out-state";
import { EmptyWatchList } from "./_components/empty-watch-list";
import { getWatchList } from "@/api/server";
import { getSession } from "@/lib/actions";
import { appConfig } from "@/lib/config";
import Image from "next/image";
import { RemoveFromWatchlist } from "./_components/remove-from-watchlist";
import { ErrorMessage } from "@/components/error-message";

export default async function WatchList() {
  const session = await getSession();

  if (!session.isValid) return <LoggedOutState />;

  const watchList = await getWatchList(session.session);

  if (!watchList.success) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <ErrorMessage
          title="Failed to load watch list"
          message="We couldn't load your watch list at this time. Please try again later."
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pt-28 md:pt-36 space-y-12 pb-16 md:pb-24">
      <header>
        <h1 className="hidden md:inline-block text-center text-3xl font-semibold w-full">
          Watch List
        </h1>
      </header>
      <main className="space-y-6 px-4 min-h-[50vh]">
        {watchList.data.items.length === 0 ? (
          <EmptyWatchList />
        ) : (
          watchList.data.items.map((item) => {
            const imageUrl = `${appConfig.tmdbImageBaseURL}${item.imageUrl}`;
            return (
              <>
                <div
                  key={item._id}
                  className="hidden md:flex items-center gap-4 p-4 rounded-xl bg-foreground/5 hover:bg-foreground/10 transition-colors"
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
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      {item.type === "movie" ? (
                        <>
                          <span>{item.rating.toFixed(2)}</span>
                          <span>•</span>
                          <span>{item.releaseDate}</span>
                          <span>•</span>
                          <span className="capitalize">{item.type}</span>
                          <span>•</span>
                          <span>{item.duration}&nbsp;mins</span>
                        </>
                      ) : (
                        <>
                          <span>{item.rating.toFixed(2)}</span>
                          <span>•</span>
                          <span>{item.releaseDate}</span>
                          <span>•</span>
                          <span className="capitalize">{item.type}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <RemoveFromWatchlist
                    session={session.session}
                    id={item._id}
                  />
                </div>
                <div
                  key={item._id}
                  className="flex flex-col gap-2 p-4 rounded-xl bg-foreground/10 hover:bg-gray-900/70 transition-colors md:hidden"
                >
                  <div className="flex gap-x-4 items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-white truncate">
                      {item.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    {item.type === "movie" ? (
                      <>
                        <span>{item.rating.toFixed(2)}</span>
                        <span>•</span>
                        <span>{item.releaseDate}</span>
                        <span>•</span>
                        <span className="capitalize">{item.type}</span>
                        <span>•</span>
                        <span>{item.duration}&nbsp;mins</span>
                      </>
                    ) : (
                      <>
                        <span>{item.rating.toFixed(2)}</span>
                        <span>•</span>
                        <span>{item.releaseDate}</span>
                        <span>•</span>
                        <span className="capitalize">{item.type}</span>
                      </>
                    )}
                  </div>

                  <RemoveFromWatchlist
                    session={session.session}
                    id={item._id}
                  />
                </div>
              </>
            );
          })
        )}
      </main>
    </div>
  );
}
