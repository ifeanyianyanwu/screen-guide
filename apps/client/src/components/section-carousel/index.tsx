"use client";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import * as React from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Genre, Movie, TVShow } from "@/types/media";
import { cn } from "@/lib/utils";
import { DetailedCard } from "./detailed-card";
import { StandardCard } from "./standard-card";
import { CarouselProgress } from "./carousel-progress";
import { cardVariants, containerVariants } from "./animations/variants";

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

  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    once: true,
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

    api.on("select", () => {
      // Set animating state when transition starts
      setIsAnimating(true);
      setCurrent(api.selectedScrollSnap() + 1);

      // Reset after animation completes
      setTimeout(() => setIsAnimating(false), 300);
    });

    // Cleanup listener
    return () => {
      api.off("select", (api) => api.destroy());
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
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className="w-full text-white container mx-auto px-4 space-y-4"
    >
      <motion.h2
        variants={cardVariants}
        custom={0}
        className="text-3xl font-bold mb-6"
      >
        {sectionTitle}
      </motion.h2>

      <Carousel
        className="w-full"
        setApi={setApi}
        opts={{
          align: "start",
        }}
      >
        <motion.div
          className="w-full relative"
          animate={{
            opacity: isAnimating ? 0.8 : 1,
            scale: isAnimating ? 0.98 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <CarouselContent
            className="-ml-8"
            containerClassname={
              carouselType === "overflow" ? "overflow-visible" : ""
            }
          >
            <AnimatePresence>
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
                          isInView={isInView}
                        />
                      ) : (
                        <StandardCard
                          media={media}
                          mediaType={mediaType}
                          genres={genres}
                          isInView={isInView}
                        />
                      )}
                    </CarouselItem>
                  );
                })}
            </AnimatePresence>
          </CarouselContent>
        </motion.div>
        <CarouselProgress
          current={current}
          count={count}
          isAnimating={isAnimating}
          progress={progress}
          handleNext={handleNext}
          handlePrev={handlePrev}
        />
      </Carousel>
    </motion.div>
  );
}
