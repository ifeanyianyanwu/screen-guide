"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
import Image from "next/image";
import { Genre, TVShow, Movie } from "@/types/media";
import { getYear } from "@/lib/utils";
import { tmdbImage } from "@/lib/config";
import {
  type ComponentType,
  type CSSProperties,
  type KeyboardEvent,
  useRef,
  useState,
} from "react";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import dynamic from "next/dynamic";
import type { YouTubeProps } from "react-youtube";
import { TransitionLink } from "./transition-link";

// The YouTube player is only needed after the user clicks play, so keep it
// (and the YouTube iframe API loader) out of the initial bundle.
const YouTube = dynamic<YouTubeProps>(
  () =>
    import("react-youtube").then(
      (mod) => mod.default as unknown as ComponentType<YouTubeProps>
    ),
  { ssr: false }
);

interface MovieCardSectionProps {
  data: Movie | TVShow;
  genres: Genre[];
  mediaType: "movie" | "tv";
  /** YouTube video key of the trailer, fetched on the server. */
  trailerKey?: string;
}

// Staggered fade-up (`.reveal` in globals.css), same timing as before:
// 1s, ease [0.33, 1, 0.68, 1], 0.1s apart.
const fadeUp = (i: number) => ({ "--delay": `${i * 0.1}s` } as CSSProperties);

export default function MovieCardSection({
  data,
  genres,
  mediaType,
  trailerKey,
}: MovieCardSectionProps) {
  const [showVideo, setShowVideo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInViewOnce(ref, {
    amount: 0.2,
    margin: "0px 0px -10% 0px",
  });

  const poster_path = tmdbImage(data.backdrop_path, "w1280");
  const title = "title" in data ? data.title : data.name;
  const date = "release_date" in data ? data.release_date : data.first_air_date;
  const videoId = trailerKey ?? "";

  const handleVideoStateChange = (event: { data: number }) => {
    // YouTube player state changes: 2 = paused
    if (event.data === 2) {
      setShowVideo(false);
    }
  };

  const youtubeOptions = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      controls: 1,
      rel: 0,
    },
  };

  return (
    <div
      ref={ref}
      data-inview={isInView}
      className="w-full bg-gradient-to-br via-sky-400 to-sky-500 from-sky-300"
    >
      <div className="container mx-auto px-4 py-28 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-6">
          <div className="reveal flex gap-4" style={fadeUp(0)}>
            {data.genre_ids.map((id: number) => {
              const resolvedGenreName = genres.find((item) => item.id == id);
              return resolvedGenreName ? (
                <Badge
                  className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-white/90 text-sm"
                  key={id}
                >
                  {resolvedGenreName.name}
                </Badge>
              ) : undefined;
            })}
          </div>

          <h2
            className="reveal text-3xl font-bold text-white"
            style={fadeUp(1)}
          >
            {title}
          </h2>

          <div
            className="reveal flex items-center gap-4 text-white/80"
            style={fadeUp(2)}
          >
            <span>{data.vote_average.toFixed(1)}</span>
            <span className="size-1 bg-white/60 rounded-full" />
            <p className="text-white/80">{getYear(date)}</p>
          </div>

          <p className="reveal text-white/90 max-w-xl" style={fadeUp(3)}>
            {data.overview}
          </p>

          <div
            className="reveal flex items-center gap-8 pt-4"
            style={fadeUp(4)}
          >
            {data.adult && (
              <Badge variant="secondary" className="text-white border-white">
                18+
              </Badge>
            )}
            <TransitionLink href={`/${mediaType}/${data.id}`} reset>
              <Button
                asChild
                variant="link"
                className="text-white hover:text-white/80 px-0"
              >
                <span>More Details</span>
              </Button>
            </TransitionLink>
          </div>
        </div>
        <div
          style={fadeUp(1)}
          className="reveal relative flex-1 aspect-video w-full rounded-xl overflow-hidden group cursor-pointer"
          onClick={() => !showVideo && setShowVideo(true)}
          {...(!showVideo && videoId
            ? {
                role: "button",
                tabIndex: 0,
                "aria-label": `Play trailer: ${title}`,
                onKeyDown: (event: KeyboardEvent) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowVideo(true);
                  }
                },
              }
            : {})}
        >
          {showVideo && videoId ? (
            <div className="absolute inset-0 w-full h-full">
              <YouTube
                videoId={videoId}
                opts={youtubeOptions}
                onStateChange={handleVideoStateChange}
                className="w-full h-full"
              />
            </div>
          ) : (
            <>
              {poster_path && (
                <Image
                  src={poster_path}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in">
                <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
