"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SliderMainItem } from "@/components/ui/carousel";
import { appConfig } from "@/lib/config";
import { getYear } from "@/lib/utils";
import { Genre, TrendingMediaItem } from "@/types/media";
import { Star } from "lucide-react";
import { useMemo } from "react";

type Genres = { genres: Genre[] };

type AnimatedCarouselItemProps = {
  media: TrendingMediaItem;
  tvGenres: Genres;
  movieGenres: Genres;
};

export const AnimatedCarouselItem = ({
  media,
  tvGenres,
  movieGenres,
}: AnimatedCarouselItemProps) => {
  const backdrop_path = `${appConfig.imageBaseURL}${media.backdrop_path}`;

  const genres = useMemo(
    () => [...tvGenres.genres, ...movieGenres.genres],
    [tvGenres, movieGenres]
  );

  return (
    <SliderMainItem
      key={media.id}
      className="min-h-svh bg-center bg-cover bg-no-repeat bg-black/70 bg-blend-overlay"
      style={{
        backgroundImage: `url(${backdrop_path})`,
      }}
    >
      <div className="size-full container mx-auto px-4 content-center grid">
        <div className="grid gap-10 max-w-xl lg:max-w-3xl">
          <div className="grid gap-5">
            <div className="flex gap-2 items-center flex-wrap">
              {media.genre_ids.map((id: number) => {
                const resolvedGenreName = genres.find((item) => item.id == id);
                return resolvedGenreName ? (
                  <Badge
                    key={id}
                    className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-paragraph/90 text-sm"
                  >
                    {resolvedGenreName.name}
                  </Badge>
                ) : undefined;
              })}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold">
              {media.name || media.title}
            </h1>
            <div className="flex gap-4 items-center">
              <span className="flex items-center gap-1">
                <p>{media.vote_average.toFixed(1)}</p>
                <Star
                  size={16}
                  color="#ffd500"
                  fill="#ffd500"
                  strokeWidth={1.25}
                />
              </span>
              <span className="size-1 bg-paragraph/70 rounded-full"></span>
              <p className="text-paragraph/90 text-lg">
                {getYear(media.release_date || media.first_air_date)}
              </p>
            </div>
          </div>
          <p className="text-pretty text-paragraph md:text-lg">
            {media.overview}
          </p>
          <Button className="text-base h-12 w-fit px-10">More Details</Button>
          {media.adult ? (
            <Badge className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-paragraph/90 text-sm w-fit">
              18+
            </Badge>
          ) : null}
        </div>
      </div>
    </SliderMainItem>
  );
};
