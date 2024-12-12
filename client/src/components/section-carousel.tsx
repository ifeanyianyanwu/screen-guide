"use client";

import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Badge } from "./ui/badge";
import * as React from "react";
import { appConfig } from "@/lib/config";
import { Genre, MediaItem } from "@/types/media";
import { cn, getYear } from "@/lib/utils";

type SectionCarouselProps = {
  carouselType?: "overflow" | "compact";
  cardType?: "standard" | "detailed";
  length?: number;
  data: MediaItem[];
  itemsPerView?: 2 | 4;
  genres: Genre[];
};

export function SectionCarousel({
  carouselType = "compact",
  length = 10,
  data,
  itemsPerView = 4,
  cardType = "standard",
  genres,
}: SectionCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const ItemsPerViewMatcher = {
    2: "md:basis-1/2",
    4: "md:basis-1/2 lg:basis-1/3 xl:basis-1/4",
  };

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const progress = React.useMemo(() => {
    return ((current - 1) / (count - 1)) * 100;
  }, [current, count]);

  return (
    <Carousel
      className="w-full"
      setApi={setApi}
      opts={{
        align: "start",
      }}
    >
      <CarouselContent
        className="-ml-4"
        containerClassname={
          carouselType === "overflow" ? "overflow-visible" : ""
        }
      >
        {data.slice(0, length).map((media) => {
          const poster_path = `${appConfig.imageBaseURL}${media.poster_path}`;
          return (
            <CarouselItem
              key={media.id}
              className={cn("pl-4", ItemsPerViewMatcher[itemsPerView])}
            >
              {cardType === "detailed" ? (
                <Card className="border-0 bg-transparent rounded-[20px] overflow-hidden">
                  <CardContent className="relative aspect-[1.77/1] p-0">
                    <Image
                      src={poster_path}
                      alt={(media.name || media.title) as string}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <Badge
                        variant="outline"
                        className="mb-3 bg-[#F3C53C] text-black border-0 font-bold px-[6px] py-[2px] text-xs rounded-sm"
                      >
                        IMDb {media.vote_average.toFixed(1)}
                      </Badge>
                      <h3 className="text-[22px] font-bold mb-2">
                        {media.title}
                      </h3>
                      <p className="text-sm text-[#FFFFFFB2] line-clamp-2 leading-5">
                        {media.overview}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 bg-transparent">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <div className="absolute top-2 right-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
                      <span className="font-semibold">
                        {media.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <Image
                      src={poster_path}
                      alt={(media.name || media.title) as string}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold">{media.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>
                        {getYear(media.first_air_date || media.release_date)}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-400" />
                      <span>
                        {genres[media.genre_ids[media.genre_ids.length - 1]]
                          ?.name || "Drama"}
                      </span>
                    </div>
                  </div>
                </Card>
              )}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center space-x-1 text-sm bg-muted rounded-md p-2">
          <span className="font-medium">
            {current.toString().padStart(2, "0")}
          </span>
          <span className="text-[#FFFFFF66]">/</span>
          <span className="text-[#FFFFFF66]">
            {count.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="flex-1 mx-4">
          <div className="h-[3px] bg-[#FFFFFF14] rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex space-x-2 relative">
          <CarouselPrevious className="relative left-0 top-4 h-8 w-8 bg-[#FFFFFF14] hover:bg-[#FFFFFF29] border-0 text-white rounded-lg" />
          <CarouselNext className="relative top-4 right-0 h-8 w-8 bg-[#FFFFFF14] hover:bg-[#FFFFFF29] border-0 text-white rounded-lg" />
        </div>
      </div>
    </Carousel>
  );
}
