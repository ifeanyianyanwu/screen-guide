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
import { appConfig } from "@/lib/config";
import { getYear } from "@/lib/utils";
import { Star } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import * as React from "react";
import Link from "next/link";

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

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const onThumbClick = (index: number) => {
    if (!api) return;
    api.scrollTo(index);
  };

  return (
    <Carousel className="w-full relative" opts={{ loop: true }} setApi={setApi}>
      <CarouselContent>
        {data.results.slice(0, length).map((media, index: number) => (
          <AnimatedCarouselItem key={index} genres={genres} media={media} />
        ))}
      </CarouselContent>
      <div className="absolute left-1/2 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 container px-4 flex md:justify-end max-md:bottom-8 justify-center rotate-90 md:rotate-0">
        <div className="grid place-items-center gap-1 md:gap-2">
          {Array.from({ length }).map((_, index) => (
            <Button
              onClick={() => onThumbClick(index)}
              key={index}
              data-active={current === index + 1}
              className="relative h-2 md:h-4 before:content-[''] before:h-0.5 before:data-[active='false']:w-5 md:before:data-[active='false']:w-6 md:before:data-[active='true']:w-12 before:data-[active='true']:w-8 before:data-[active='false']:bg-foreground/30 before:data-[active='true']:bg-foreground before:transition-all before:absolute before: before:rounded-full before:top-1/2 before:-translate-y-1/2 !w-12 !bg-transparent"
            >
              <span className="sr-only">slide {current} </span>
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

const AnimatedCarouselItem = ({ media, genres }: AnimatedCarouselItemProps) => {
  const backdrop_path = `${appConfig.imageBaseURL}${media.backdrop_path}`;

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const title = "title" in media ? media.title : media.name;
  const date =
    "release_date" in media ? media.release_date : media.first_air_date;

  return (
    <CarouselItem key={media.id} className="min-h-svh relative overflow-hidden">
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-black/70 bg-blend-overlay"
        style={{
          backgroundImage: `url(${backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
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
              className="grid gap-10 max-w-xl lg:max-w-3xl"
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
                <Link href={`/${media.media_type}/${media.id}`}>
                  <Button
                    className="relative overflow-hidden group hover:scale-105 transition-transform duration-400 ease-in"
                    size="lg"
                  >
                    <span
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 
                     group-hover:w-[500px] group-hover:h-[500px] 
                     bg-white rounded-full 
                     transition-all duration-500 ease-in"
                    />
                    <span className="relative z-10 group-hover:text-black text-white transition-all delay-200 flex gap-x-2 text-base items-center ease-in">
                      More Details
                    </span>
                  </Button>
                </Link>
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
