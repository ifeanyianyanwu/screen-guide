import { appConfig } from "@/lib/config";
import { Movie, TVShow } from "@/types/media";
import { MediaType } from "./types";
import {
  badgeVariants,
  cardVariants,
  imageVariants,
} from "./animations/variants";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { TransitionLink } from "../transition-link";

const AnimatedCard = motion(Card);

export const DetailedCard = ({
  media,
  mediaType,
  isInView,
}: {
  media: Movie | TVShow;
  mediaType: MediaType;
  isInView: boolean;
}) => {
  const backdrop_path = media.backdrop_path
    ? `${appConfig.tmdbImageBaseURL}${media.backdrop_path}`
    : null;

  const title = "title" in media ? media.title : media.name;

  return (
    <TransitionLink href={`/${media.media_type || mediaType}/${media.id}`}>
      <AnimatedCard
        variants={cardVariants}
        custom={1}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        // animate="visible"
        whileHover="hover"
        className="border-0 bg-transparent rounded-3xl overflow-hidden"
      >
        <CardContent className="relative aspect-[1.77/1] p-0">
          <motion.div
            className="relative w-full h-full"
            variants={imageVariants}
          >
            <Image
              src={backdrop_path || ""}
              alt={title}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

          <motion.div className="absolute bottom-0 left-0 right-0 p-8 grid gap-y-4">
            <motion.div
              variants={badgeVariants}
              initial="initial"
              animate="animate"
            >
              <Badge
                variant="outline"
                className="bg-[#F3C53C] text-black border-0 font-bold text-sm rounded-sm w-fit"
              >
                {media.vote_average.toFixed(1)}
              </Badge>
            </motion.div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="line-clamp-2 text-paragraph leading-relaxed">
              {media.overview}
            </p>
          </motion.div>
        </CardContent>
      </AnimatedCard>
    </TransitionLink>
  );
};
