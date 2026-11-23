import {
  getAiringTv,
  getPopularTv,
  getTopRatedTv,
  getTrailerKey,
  getTrendingTvShows,
  getTvGenres,
  getTvOnTheAir,
} from "@/api/tmdb";
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
  const [
    trendingTvShows,
    airingTodayTvShows,
    onTheAirTvShows,
    popularTvShows,
    topRatedTvShows,
    tvGenres,
  ] = await Promise.all([
    getTrendingTvShows<Media>("day"),
    getAiringTv<Media>(),
    getTvOnTheAir<Media>(),
    getPopularTv<Media>(),
    getTopRatedTv<Media>(),
    getTvGenres<Genres>(),
  ]);
  const featuredShow = popularTvShows.results[0];
  // Previously fetched from the *movie* videos endpoint with a TV id.
  const featuredTrailerKey = await getTrailerKey("tv", featuredShow.id);

  const genres = tvGenres.genres;
  const mediaType = "tv";

  return (
    <main className="overflow-hidden space-y-14 lg:space-y-20 pb-16 md:pb-24">
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

      <MovieCardSection
        data={featuredShow}
        genres={genres}
        mediaType="tv"
        trailerKey={featuredTrailerKey}
      />

      <SectionCarousel
        genres={genres}
        data={topRatedTvShows.results}
        sectionTitle="Top Rated TV Shows"
        mediaType={mediaType}
      />
    </main>
  );
}
