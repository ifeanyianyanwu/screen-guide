import type { CSSProperties } from "react";
import { tmdbImage } from "@/lib/config";
import { Movie, TVShow } from "@/types/media";
import { MediaType } from "./types";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { TransitionLink } from "../transition-link";

export const DetailedCard = ({
  media,
  mediaType,
}: {
  media: Movie | TVShow;
  mediaType: MediaType;
}) => {
  const backdrop_path = tmdbImage(media.backdrop_path, "w1280");

  const title = "title" in media ? media.title : media.name;

  return (
    <TransitionLink
      href={`/${media.media_type || mediaType}/${media.id}`}
      reset
    >
      {/* Fades up when the section scrolls into view (`.reveal`). */}
      <Card
        className="reveal group/detailed-card border-0 bg-transparent rounded-3xl overflow-hidden"
        style={{ "--delay": "0.1s" } as CSSProperties}
      >
        <CardContent className="relative aspect-[1.77/1] p-0">
          <div className="relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/detailed-card:scale-105">
            {backdrop_path && (
              <Image
                src={backdrop_path}
                alt={title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 grid gap-y-4">
            <div className="pop-in">
              <Badge
                variant="outline"
                className="bg-[#F3C53C] text-black border-0 font-bold text-sm rounded-sm w-fit"
              >
                {media.vote_average.toFixed(1)}
              </Badge>
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="line-clamp-2 text-paragraph leading-relaxed">
              {media.overview}
            </p>
          </div>
        </CardContent>
      </Card>
    </TransitionLink>
  );
};
