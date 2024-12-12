import {
  getAiringTv,
  getAllTrending,
  getMoviesGenres,
  getTopRatedMovies,
  getTvGenres,
} from "@/api";
import { HeroCarousel } from "@/components/hero-carousel";
import { SectionCarousel } from "@/components/section-carousel";
import { Genre, MediaItem } from "@/types/media";
import { Pagination } from "@/types/shared";
import React from "react";

type Media = {
  results: MediaItem[];
} & Pagination;

type Genres = { genres: Genre[] };

export default async function Home() {
  const trending = await getAllTrending<Media>("day");
  const topRated = await getTopRatedMovies<Media>();
  const airingTv = await getAiringTv<Media>();
  const [tvGenres, movieGenres] = await Promise.all([
    getTvGenres<Genres>(),
    getMoviesGenres<Genres>(),
  ]);
  const genres = [...tvGenres.genres, ...movieGenres.genres];
  return (
    <main className="overflow-hidden">
      <HeroCarousel genres={genres} data={trending} />
      <div className="w-full bg-[#121212] text-white py-8 container mx-auto px-4">
        <h2 className="text-[32px] font-bold mb-6">Popular Movies</h2>
        <SectionCarousel
          genres={genres}
          data={topRated.results}
          carouselType="overflow"
        />
      </div>
      <div className="w-full bg-[#121212] text-white py-8 container mx-auto px-4">
        <h2 className="text-[32px] font-bold mb-6">Airing Today on TV</h2>
        <SectionCarousel
          genres={genres}
          data={airingTv.results}
          itemsPerView={2}
          cardType="detailed"
        />
      </div>

      <div className="container mx-auto px-4">
        {[...Array(20)].map((_, i) => (
          <p key={i} className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
            dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed
            auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in
            nulla enim. Phasellus molestie magna non est bibendum non venenatis
            nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris
            iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
            Proin quis tortor orci. Etiam at risus et justo dignissim congue.
            Donec congue lacinia dui, a porttitor lectus condimentum laoreet.
            Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum
            faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla
            at nulla justo, eget luctus tortor.
          </p>
        ))}
      </div>
    </main>
  );
}
