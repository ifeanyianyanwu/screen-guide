import { Genre, Movie, TVShow } from "@/types/media";
import { MediaType } from "./types";
import { appConfig } from "@/lib/config";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { cardVariants, imageVariants } from "./animations/variants";
import Image from "next/image";
import { getYear } from "@/lib/utils";
import Link from "next/link";

const AnimatedCard = motion(Card);

export const StandardCard = ({
  media,
  mediaType,
  genres,
  isInView,
}: {
  media: Movie | TVShow;
  mediaType: MediaType;
  genres: Genre[];
  isInView: boolean;
}) => {
  const poster_path = media.poster_path
    ? `${appConfig.imageBaseURL}${media.poster_path}`
    : null;
  const backdrop_path = media.backdrop_path
    ? `${appConfig.imageBaseURL}${media.backdrop_path}`
    : null;

  const title = "title" in media ? media.title : media.name;
  const date =
    "release_date" in media ? media.release_date : media.first_air_date;

  const genre = genres?.find(
    (genre) => genre.id === media.genre_ids?.[media.genre_ids?.length - 1]
  ) || { name: "" };

  return (
    <Link href={`/${mediaType}/${media.id}`}>
      <AnimatedCard
        variants={cardVariants}
        custom={1}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        whileHover="hover"
        className="border-0 bg-transparent group/media-card overflow-hidden"
      >
        <CardContent className="p-0">
          <div className="relative aspect-video md:aspect-[3/4] overflow-hidden rounded-xl">
            <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-md">
              <span className="font-semibold text-sm">
                {media.vote_average?.toFixed(1)}
              </span>
            </div>
            <motion.div
              className="w-full h-full"
              variants={imageVariants}
              initial="initial"
              whileHover="hover"
              animate="initial"
            >
              <Image
                src={poster_path || ""}
                alt={title}
                fill
                className="object-cover max-md:hidden"
              />
              <Image
                src={backdrop_path || ""}
                alt={title}
                fill
                className="object-cover md:hidden"
              />
            </motion.div>
          </div>
          <div className="mt-4 grid content-start gap-y-2">
            <h2 className="text-lg font-semibold line-clamp-2">{title}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{getYear(date)}</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>{genre.name}</span>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>
    </Link>
  );
};
