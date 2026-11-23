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
import { getYear } from "@/lib/utils";
import { Star } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  const [current, setCurrent] = React.useState(0);
  // Defer the other slides' backdrops until the first (LCP) one has loaded so
  // they don't compete with it for bandwidth.
  const [firstSlideLoaded, setFirstSlideLoaded] = React.useState(false);
  const onFirstSlideLoad = React.useCallback(
    () => setFirstSlideLoaded(true),
    []
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // "trending/all" can include people, which have no backdrop or detail page.
  const slides = (data.results as (Movie | TVShow)[])
    .filter((media) => media.media_type !== "person" && media.backdrop_path)
    .slice(0, length);

  const onThumbClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  return (
    <Carousel className="w-full relative" opts={{ loop: true }} setApi={setApi}>
      <CarouselContent>
        {slides.map((media, index: number) => (
          <AnimatedCarouselItem
            key={media.id}
            genres={genres}
            media={media}
            isFirst={index === 0}
            loadImage={index === 0 || firstSlideLoaded}
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
              data-active={current === index + 1}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={current === index + 1 ? "true" : undefined}
              className="relative h-2 md:h-4 before:content-[''] before:h-0.5 before:data-[active='false']:w-5 md:before:data-[active='false']:w-6 md:before:data-[active='true']:w-12 before:data-[active='true']:w-8 before:data-[active='false']:bg-foreground/30 before:data-[active='true']:bg-foreground before:transition-all before:absolute before: before:rounded-full before:top-1/2 before:-translate-y-1/2 !w-12 !bg-transparent"
            >
            </Button>
          ))}
        </div>
      </div>
    </Carousel>
  );
}

type AnimatedCarouselItemProps = {
  media: Movie | TVShow;
  genres: Genre[];
  isFirst: boolean;
  loadImage: boolean;
  onImageLoad?: () => void;
};

const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const AnimatedCarouselItem = ({
  media,
  genres,
  isFirst,
  loadImage,
  onImageLoad,
}: AnimatedCarouselItemProps) => {
  const backdrop_path = tmdbImage(media.backdrop_path, "original");

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const title = "title" in media ? media.title : media.name;
  const date =
    "release_date" in media ? media.release_date : media.first_air_date;

  return (
    <CarouselItem key={media.id} className="min-h-svh relative overflow-hidden">
      {/*
        Backdrop zooms out (scale 1.2 -> 1) while fading in. The fade is done
        with an overlay in the page background colour fading out instead of
        animating the image's own opacity: it looks identical, but the image is
        painted (opacity 1) as soon as it loads, so it counts for LCP before
        hydration instead of after the animation.
      */}
      <motion.div
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        {backdrop_path && (
          <Image
            src={backdrop_path}
            alt=""
            fill
            sizes="100vw"
            priority={isFirst}
            loading={isFirst ? undefined : loadImage ? "eager" : "lazy"}
            onLoad={onImageLoad}
            className="object-cover object-center"
          />
        )}
        {/* Same result as the previous bg-black/70 + background-blend-mode: overlay */}
        <div className="absolute inset-0 bg-black/70" />
      </motion.div>
      <motion.div
        aria-hidden
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-background pointer-events-none"
      />

      <div
        className="relative size-full container mx-auto px-4 content-center grid"
        ref={ref}
      >
        <AnimatePresence>
          {isInView && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-6 md:gap-10 max-w-xl lg:max-w-3xl"
            >
              <motion.div className="grid gap-5">
                <motion.div
                  variants={fadeInUp}
                  custom={0}
                  className="flex gap-2 items-center flex-wrap"
                >
                  {media.genre_ids.map((id: number) => {
                    const resolvedGenreName = genres.find(
                      (item) => item.id == id
                    );
                    return resolvedGenreName ? (
                      <motion.div
                        key={id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-paragraph/90 text-sm">
                          {resolvedGenreName.name}
                        </Badge>
                      </motion.div>
                    ) : undefined;
                  })}
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  custom={1}
                  className="text-4xl md:text-6xl font-extrabold"
                >
                  {title}
                </motion.h1>

                <motion.div
                  variants={fadeInUp}
                  custom={2}
                  className="flex gap-4 items-center"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.5 }}
                    className="flex items-center gap-1"
                  >
                    <p>{media.vote_average.toFixed(1)}</p>
                    <Star
                      size={16}
                      color="#ffd500"
                      fill="#ffd500"
                      strokeWidth={1.25}
                    />
                  </motion.span>
                  <span className="size-1 bg-paragraph/70 rounded-full" />
                  <p className="text-paragraph/90 text-lg">{getYear(date)}</p>
                </motion.div>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                custom={3}
                className="text-pretty text-paragraph md:text-lg"
              >
                {media.overview}
              </motion.p>

              <motion.div variants={fadeInUp} custom={4}>
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
              </motion.div>

              {media.adult && (
                <motion.div variants={fadeInUp} custom={5}>
                  <Badge className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-paragraph/90 text-sm w-fit">
                    18+
                  </Badge>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CarouselItem>
  );
};
