"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Genre, Movie, TVShow } from "@/types/media";
import { Pagination } from "@/types/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tmdbImage } from "@/lib/config";
import { cn, getYear } from "@/lib/utils";
import { Star } from "lucide-react";
import * as React from "react";
import Image from "next/image";
import { TransitionLink } from "./transition-link";

type Trending = {
  results: TVShow[] | Movie[];
} & Pagination;

type HeroCarouselProps = {
  data: Trending;
  genres: Genre[];
  length?: number;
};

export function HeroCarousel({ data, genres, length = 5 }: HeroCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);
  // Slides that have been on screen: their copy has played its entrance.
  const [seen, setSeen] = React.useState<ReadonlySet<number>>(
    () => new Set([0])
  );
  // Don't fetch the other backdrops until the first (LCP) one has loaded, and
  // then only the slides next to the one on screen.
  const [firstSlideLoaded, setFirstSlideLoaded] = React.useState(false);
  const onFirstSlideLoad = React.useCallback(
    () => setFirstSlideLoaded(true),
    []
  );

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setSelected(index);
      setSeen((prev) => (prev.has(index) ? prev : new Set(prev).add(index)));
    };
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // "trending/all" can include people, which have no backdrop or detail page.
  const slides = (data.results as (Movie | TVShow)[])
    .filter((media) => media.media_type !== "person" && media.backdrop_path)
    .slice(0, length);

  const isNearSelected = (index: number) => {
    const distance = Math.abs(index - selected);
    // The carousel loops, so the last slide is next to the first.
    return Math.min(distance, slides.length - distance) <= 1;
  };

  const onThumbClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  return (
    <Carousel className="w-full relative" opts={{ loop: true }} setApi={setApi}>
      <CarouselContent>
        {slides.map((media, index: number) => (
          <HeroSlide
            key={media.id}
            genres={genres}
            media={media}
            isFirst={index === 0}
            hasBeenSeen={seen.has(index)}
            loadImage={
              index === 0 ||
              seen.has(index) ||
              (firstSlideLoaded && isNearSelected(index))
            }
            onImageLoad={index === 0 ? onFirstSlideLoad : undefined}
          />
        ))}
      </CarouselContent>
      <div className="absolute left-1/2 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 container px-4 flex md:justify-end max-md:bottom-8 justify-center rotate-90 md:rotate-0">
        <div className="grid place-items-center gap-1 md:gap-2">
          {slides.map((_, index) => (
            <Button
              onClick={() => onThumbClick(index)}
              key={index}
              data-active={selected === index}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={selected === index ? "true" : undefined}
              className="relative h-2 md:h-4 before:content-[''] before:h-0.5 before:data-[active='false']:w-5 md:before:data-[active='false']:w-6 md:before:data-[active='true']:w-12 before:data-[active='true']:w-8 before:data-[active='false']:bg-foreground/30 before:data-[active='true']:bg-foreground before:transition-all before:absolute before: before:rounded-full before:top-1/2 before:-translate-y-1/2 !w-12 !bg-transparent"
            >
            </Button>
          ))}
        </div>
      </div>
    </Carousel>
  );
}

type HeroSlideProps = {
  media: Movie | TVShow;
  genres: Genre[];
  isFirst: boolean;
  hasBeenSeen: boolean;
  loadImage: boolean;
  onImageLoad?: () => void;
};

const fadeUp = (i: number) =>
  ({ "--i": i } as React.CSSProperties);

/*
  The slide is fully server-rendered: the copy is in the HTML and the entrance
  animations are CSS (`.hero-*` in globals.css, same timings as the previous
  framer-motion version). Before, the copy only mounted after hydration and an
  IntersectionObserver check, so the title (the page's LCP element) waited for
  all of the page's JavaScript.
*/
const HeroSlide = ({
  media,
  genres,
  isFirst,
  hasBeenSeen,
  loadImage,
  onImageLoad,
}: HeroSlideProps) => {
  // The backdrop sits under a 70% black overlay, so TMDB's w1280 file is
  // plenty; "original" files are up to 4K and ~1 MB each.
  const backdrop_path = tmdbImage(media.backdrop_path, "w1280");

  const title = "title" in media ? media.title : media.name;
  const date =
    "release_date" in media ? media.release_date : media.first_air_date;
  const mediaGenres = media.genre_ids
    .map((id) => genres.find((item) => item.id == id))
    .filter((genre): genre is Genre => Boolean(genre));

  return (
    <CarouselItem className="min-h-svh relative overflow-hidden">
      {/* Backdrop zooms out (scale 1.2 -> 1) while an overlay in the page
          background colour fades away. */}
      <div className="hero-zoom absolute inset-0">
        {backdrop_path && loadImage && (
          <Image
            src={backdrop_path}
            alt=""
            fill
            sizes="100vw"
            quality={60}
            priority={isFirst}
            onLoad={onImageLoad}
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div
        aria-hidden
        className="hero-reveal absolute inset-0 bg-background pointer-events-none"
      />

      <div
        className={cn(
          "relative size-full container mx-auto px-4 content-center grid",
          !hasBeenSeen && "hero-idle"
        )}
      >
        <div className="grid gap-6 md:gap-10 max-w-xl lg:max-w-3xl">
          <div className="grid gap-5">
            <div
              className="hero-fade-up flex gap-2 items-center flex-wrap"
              style={fadeUp(0)}
            >
              {mediaGenres.map((genre) => (
                <div key={genre.id} className="hero-pop">
                  <Badge className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-paragraph/90 text-sm">
                    {genre.name}
                  </Badge>
                </div>
              ))}
            </div>

            {isFirst ? (
              <h1
                className="hero-fade-up text-4xl md:text-6xl font-extrabold"
                style={fadeUp(1)}
              >
                {title}
              </h1>
            ) : (
              <h2
                className="hero-fade-up text-4xl md:text-6xl font-extrabold"
                style={fadeUp(1)}
              >
                {title}
              </h2>
            )}

            <div
              className="hero-fade-up flex gap-4 items-center"
              style={fadeUp(2)}
            >
              <span className="flex items-center gap-1">
                <p>{media.vote_average.toFixed(1)}</p>
                <Star
                  size={16}
                  color="#ffd500"
                  fill="#ffd500"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </span>
              <span className="size-1 bg-paragraph/70 rounded-full" />
              <p className="text-paragraph/90 text-lg">{getYear(date)}</p>
            </div>
          </div>

          <p
            className="hero-fade-up text-pretty text-paragraph md:text-lg"
            style={fadeUp(3)}
          >
            {media.overview}
          </p>

          <div className="hero-fade-up" style={fadeUp(4)}>
            <TransitionLink
              href={`/${media.media_type}/${media.id}`}
              reset
              className="w-fit"
            >
              <Button
                asChild
                className="relative overflow-hidden group hover:scale-105 transition-transform duration-400 ease-in"
                size="lg"
              >
                <span>
                  <span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 
                 group-hover:w-[500px] group-hover:h-[500px] 
                 bg-white rounded-full 
                 transition-all duration-500 ease-in"
                  />
                  <span className="relative z-10 group-hover:text-black text-white transition-all delay-200 flex gap-x-2 text-base items-center ease-in">
                    More Details
                  </span>
                </span>
              </Button>
            </TransitionLink>
          </div>

          {media.adult && (
            <div className="hero-fade-up" style={fadeUp(5)}>
              <Badge className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-paragraph/90 text-sm w-fit">
                18+
              </Badge>
            </div>
          )}
        </div>
      </div>
    </CarouselItem>
  );
};
