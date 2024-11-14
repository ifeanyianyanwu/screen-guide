import {
  Carousel,
  CarouselIndicator,
  CarouselMainContainer,
  CarouselThumbsContainer,
} from "@/components/ui/carousel";
import { getAllTrending, getMoviesGenres, getTvGenres } from "@/api";
import { AnimatedCarouselItem } from "./animated-carousel-item";
import { Genre, TrendingMediaItem } from "@/types/media";
import { Pagination } from "@/types/shared";

type Trending = {
  results: TrendingMediaItem[];
} & Pagination;

type Genres = { genres: Genre[] };

export async function HeroCarousel() {
  const trending = await getAllTrending<Trending>("day");
  const [tvGenres, movieGenres] = await Promise.all([
    getTvGenres<Genres>(),
    getMoviesGenres<Genres>(),
  ]);

  return (
    <Carousel className="w-full relative" carouselOptions={{ loop: true }}>
      <CarouselMainContainer>
        {trending.results.slice(0, 5).map((media, index: number) => (
          <AnimatedCarouselItem
            key={index}
            tvGenres={tvGenres}
            movieGenres={movieGenres}
            media={media}
          />
        ))}
      </CarouselMainContainer>
      <div className="absolute left-1/2 -translate-x-1/2 md:top-1/2 md:-translate-y-1/2 container px-4 flex md:justify-end max-md:bottom-8 justify-center rotate-90 md:rotate-0">
        <CarouselThumbsContainer className="grid place-items-center gap-1 md:gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselIndicator
              key={index}
              index={index}
              className="relative h-2 md:h-4 before:content-[''] before:h-0.5 before:data-[active='false']:w-5 md:before:data-[active='false']:w-6 md:before:data-[active='true']:w-12 before:data-[active='true']:w-8 before:data-[active='false']:bg-foreground/50 before:data-[active='true']:bg-foreground before:transition-all before:absolute before: before:rounded-full before:top-1/2 before:-translate-y-1/2 !w-12 !bg-transparent"
            />
          ))}
        </CarouselThumbsContainer>
      </div>
    </Carousel>
  );
}
