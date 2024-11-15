"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SliderMainItem } from "@/components/ui/carousel";
import { appConfig } from "@/lib/config";
import { getYear } from "@/lib/utils";
import { Genre, TrendingMediaItem } from "@/types/media";
import { Star } from "lucide-react";
import { useMemo, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

type Genres = { genres: Genre[] };

type AnimatedCarouselItemProps = {
  media: TrendingMediaItem;
  tvGenres: Genres;
  movieGenres: Genres;
};

const fadeInUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <SliderMainItem
      key={media.id}
      className="min-h-svh relative overflow-hidden"
    >
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
                  {media.name || media.title}
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
                  <p className="text-paragraph/90 text-lg">
                    {getYear(media.release_date || media.first_air_date)}
                  </p>
                </motion.div>
              </motion.div>

              <motion.p
                variants={fadeInUp}
                custom={3}
                className="text-pretty text-paragraph md:text-lg"
              >
                {media.overview}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                custom={4}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="text-base h-12 w-fit px-10">
                  More Details
                </Button>
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
    </SliderMainItem>
  );
};

export default AnimatedCarouselItem;
