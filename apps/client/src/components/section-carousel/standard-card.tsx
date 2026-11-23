import type { CSSProperties } from "react";
import { Genre, Movie, TVShow } from "@/types/media";
import { MediaType } from "./types";
import { tmdbImage } from "@/lib/config";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { getYear } from "@/lib/utils";
import { TransitionLink } from "../transition-link";

export const StandardCard = ({
  media,
  mediaType,
  genres,
}: {
  media: Movie | TVShow;
  mediaType: MediaType;
  genres: Genre[];
}) => {
  const poster_path = tmdbImage(media.poster_path, "w780");
  const backdrop_path = tmdbImage(media.backdrop_path, "w780");

  const title = "title" in media ? media.title : media.name;
  const date =
    "release_date" in media ? media.release_date : media.first_air_date;

  const genre = genres?.find(
    (genre) => genre.id === media.genre_ids?.[media.genre_ids?.length - 1]
  ) || { name: "" };

  return (
    <TransitionLink href={`/${mediaType}/${media.id}`} reset>
      {/* Fades up when the section scrolls into view (`.reveal`). */}
      <Card
        className="reveal border-0 bg-transparent group/media-card overflow-hidden"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <CardContent className="p-0">
          <div className="relative aspect-video md:aspect-[3/4] overflow-hidden rounded-xl">
            <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-md">
              <span className="font-semibold text-sm">
                {media.vote_average?.toFixed(1)}
              </span>
            </div>
            <div className="w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/media-card:scale-105">
              {/* Only the visible one is fetched: hidden lazy images aren't loaded. */}
              {poster_path && (
                <Image
                  src={poster_path}
                  alt={title}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, 50vw"
                  className="object-cover max-md:hidden"
                />
              )}
              {backdrop_path && (
                <Image
                  src={backdrop_path}
                  alt={title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover md:hidden"
                />
              )}
            </div>
          </div>
          <div className="mt-4 grid content-start gap-y-2">
            <h2 className="text-lg font-semibold line-clamp-2">{title}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{getYear(date)}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>{genre.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TransitionLink>
  );
};
