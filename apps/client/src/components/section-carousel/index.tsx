"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import * as React from "react";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import { Genre, Movie, TVShow } from "@/types/media";
import { cn } from "@/lib/utils";
import { DetailedCard } from "./detailed-card";
import { StandardCard } from "./standard-card";
import { CarouselProgress } from "./carousel-progress";

type SectionCarouselProps = {
  carouselType?: "overflow" | "compact";
  cardType?: "standard" | "detailed";
  length?: number;
  data: Movie[] | TVShow[];
  itemsPerView?: 2 | 4;
  genres: Genre[];
  sectionTitle: string;
  mediaType: "tv" | "movie";
};

export function SectionCarousel({
  carouselType = "compact",
  length = 10,
  data,
  itemsPerView = 4,
  cardType = "standard",
  genres,
  sectionTitle,
  mediaType,
}: SectionCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInViewOnce(ref, {
    amount: 0.2,
    margin: "0px 0px -10% 0px",
  });

  const ItemsPerViewMatcher = {
    2: "md:basis-1/2",
    4: "md:basis-1/2 lg:basis-1/3 xl:basis-1/4",
  };

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const onSelect = () => {
      // Set animating state when transition starts
      setIsAnimating(true);
      setCurrent(api.selectedScrollSnap() + 1);

      // Reset after animation completes
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsAnimating(false), 300);
    };
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
      clearTimeout(timeout);
    };
  }, [api]);

  const progress = React.useMemo(() => {
    return Math.max(0, Math.min(((current - 1) / (count - 1)) * 100, 100));
  }, [current, count]);

  const handleNext = () => {
    if (isAnimating) return;
    api?.scrollNext();
  };

  const handlePrev = () => {
    if (isAnimating) return;
    api?.scrollPrev();
  };

  return (
    <div
      ref={ref}
      data-inview={isInView}
      className="w-full text-white container mx-auto px-4 space-y-4"
    >
      <h2
        className="reveal text-3xl font-bold mb-6"
        style={{ "--delay": "0.2s" } as React.CSSProperties}
      >
        {sectionTitle}
      </h2>

      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
        }}
      >
        <div
          className={cn(
            "w-full relative transition-[opacity,transform] duration-300",
            isAnimating && "opacity-80 scale-[0.98]"
          )}
        >
          <CarouselContent
            className="-ml-8"
            containerClassname={
              carouselType === "overflow" ? "overflow-visible" : ""
            }
          >
              {data
                .slice(0, length)
                .filter(
                  (m) => typeof m.backdrop_path === "string" || m.backdrop_path
                )
                .map((media) => {
                  return (
                    <CarouselItem
                      key={media.id}
                      className={cn("pl-8", ItemsPerViewMatcher[itemsPerView])}
                    >
                      {cardType === "detailed" ? (
                        <DetailedCard
                          media={media}
                          mediaType={mediaType}
                        />
                      ) : (
                        <StandardCard
                          media={media}
                          mediaType={mediaType}
                          genres={genres}
                        />
                      )}
                    </CarouselItem>
                  );
                })}
          </CarouselContent>
        </div>
        <CarouselProgress
          current={current}
          count={count}
          isAnimating={isAnimating}
          progress={progress}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      </Carousel>
    </div>
  );
}
