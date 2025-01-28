import {
  getAllTrending,
  getMoviesGenres,
  getPopularMovies,
  getTopRatedMovies,
  getTopRatedTv,
  getTvGenres,
  getUpcomingMovies,
} from "@/api/tmdb";
import { HeroCarousel } from "@/components/hero-carousel";
import { SectionCarousel } from "@/components/section-carousel";
import { Genres, Movie, TVShow } from "@/types/media";
import { Pagination } from "@/types/shared";
import React from "react";
import MovieCardSection from "@/components/movie-card-section";

type Media = {
  results: Movie[] | TVShow[];
} & Pagination;

export default async function Home() {
  const trending = await getAllTrending<Media>("day");
  const topRatedMovies = await getTopRatedMovies<Media>();
  const popularMovies = await getPopularMovies<Media>();
  const topRatedTvShows = await getTopRatedTv<Media>();
  const upcomingMovies = await getUpcomingMovies<Media>();
  const [tvGenres, movieGenres] = await Promise.all([
    getTvGenres<Genres>(),
    getMoviesGenres<Genres>(),
  ]);
  const genres = [...tvGenres.genres, ...movieGenres.genres];
  return (
    <main className="overflow-hidden space-y-14 lg:space-y-20 pb-16 md:pb-24">
      <HeroCarousel genres={genres} data={trending} />

      <SectionCarousel
        sectionTitle="Popular Movies"
        genres={genres}
        data={popularMovies.results}
        carouselType="overflow"
        mediaType="movie"
      />

      <SectionCarousel
        sectionTitle="Top Rated TV Shows"
        genres={genres}
        data={topRatedTvShows.results}
        itemsPerView={2}
        cardType="detailed"
        mediaType="tv"
      />

      <MovieCardSection
        data={topRatedMovies.results[0]}
        genres={genres}
        mediaType="movie"
      />

      <SectionCarousel
        genres={genres}
        data={upcomingMovies.results}
        sectionTitle="Upcoming Movies"
        mediaType="movie"
      />
    </main>
  );
}
