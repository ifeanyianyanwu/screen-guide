"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import Image from "next/image";
import { Genre, TVShow, Movie } from "@/types/media";
import { getYear } from "@/lib/utils";
import { appConfig } from "@/lib/config";
import { useRef } from "react";
import { useInView, motion } from "framer-motion";

interface MovieCardectionProps {
  data: Movie | TVShow;
  genres: Genre[];
}

const fadeUp = {
  hidden: {
    y: 30,
    opacity: 0,
  },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 1,
      ease: [0.33, 1, 0.68, 1],
    },
  }),
};

const containerVariant = {
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function MovieCardSection({
  data,
  genres,
}: MovieCardectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.2,
    margin: "0px 0px -10% 0px",
  });

  const poster_path = `${appConfig.imageBaseURL}${data.backdrop_path}`;
  const title = "title" in data ? data.title : data.name;
  const date = "release_date" in data ? data.release_date : data.first_air_date;

  return (
    <motion.div
      ref={ref}
      variants={containerVariant}
      animate={isInView ? "visible" : "hidden"}
      initial="hidden"
      className="w-full bg-gradient-to-br via-sky-400 to-sky-500 from-sky-300"
    >
      <div className="container mx-auto px-4 py-28 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-6">
          <motion.div
            className="flex gap-4"
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {data.genre_ids.map((id: number) => {
              const resolvedGenreName = genres.find((item) => item.id == id);
              return resolvedGenreName ? (
                <Badge className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-white/90 text-sm">
                  {resolvedGenreName.name}
                </Badge>
              ) : undefined;
            })}
          </motion.div>

          <motion.h1
            className="text-5xl font-bold text-white"
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {title}
          </motion.h1>

          <motion.div
            className="flex items-center gap-4 text-white/80"
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <span>{data.vote_average.toFixed(1)}</span>
            <span className="size-1 bg-white/60 rounded-full" />
            <p className="text-white/80">{getYear(date)}</p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-white/90 max-w-xl"
          >
            {data.overview}
          </motion.p>

          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="flex items-center gap-8 pt-4"
          >
            {data.adult && (
              <Badge variant="secondary" className="text-white border-white">
                18+
              </Badge>
            )}
            <Button
              variant="link"
              className="text-white hover:text-white/80 px-0"
            >
              More Details
            </Button>
            <Button
              variant="link"
              className="text-white hover:text-white/80 px-0"
            >
              Watch Trailer
            </Button>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative flex-1 aspect-video w-full rounded-xl overflow-hidden group cursor-pointer"
        >
          <Image
            src={poster_path}
            alt={title}
            fill
            className="object-contain"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in">
            <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
