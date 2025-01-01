import {
  getAiringTv,
  getPopularTv,
  getTopRatedTv,
  getTrendingTvShows,
  getTvGenres,
  getTvOnTheAir,
} from "@/api";
import { HeroCarousel } from "@/components/hero-carousel";
import MovieCardSection from "@/components/movie-card-section";
import { SectionCarousel } from "@/components/section-carousel";
import { Genres, TVShow } from "@/types/media";
import { Pagination } from "@/types/shared";
import React from "react";

type Media = {
  results: TVShow[];
} & Pagination;

export default async function TvPage() {
  const trendingTvShows = await getTrendingTvShows<Media>("day");
  const airingTodayTvShows = await getAiringTv<Media>();
  const onTheAirTvShows = await getTvOnTheAir<Media>();
  const popularTvShows = await getPopularTv<Media>();
  const topRatedTvShows = await getTopRatedTv<Media>();

  const tvGenres = await getTvGenres<Genres>();

  const genres = tvGenres.genres;
  const mediaType = "tv";

  return (
    <main className="overflow-hidden space-y-14 lg:space-y-20">
      <HeroCarousel genres={genres} data={trendingTvShows} />

      <SectionCarousel
        sectionTitle="Airring Today"
        genres={genres}
        data={airingTodayTvShows.results}
        mediaType={mediaType}
      />
      <SectionCarousel
        sectionTitle="On The Air"
        genres={genres}
        data={onTheAirTvShows.results}
        carouselType="overflow"
        mediaType={mediaType}
      />

      <SectionCarousel
        sectionTitle="Popular TV Shows"
        genres={genres}
        data={popularTvShows.results.slice(1)}
        itemsPerView={2}
        cardType="detailed"
        mediaType={mediaType}
      />

      <MovieCardSection data={popularTvShows.results[0]} genres={genres} />

      <SectionCarousel
        genres={genres}
        data={topRatedTvShows.results}
        sectionTitle="Top Rated TV Shows"
        mediaType={mediaType}
      />
    </main>
  );
}
