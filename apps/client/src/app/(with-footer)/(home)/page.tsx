import {
  getAllTrending,
  getMoviesGenres,
  getPopularMovies,
  getTopRatedMovies,
  getTopRatedTv,
  getTvGenres,
  getTrailerKey,
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
  // Fetch everything in parallel (these used to run one after another).
  const [
    trending,
    topRatedMovies,
    popularMovies,
    topRatedTvShows,
    upcomingMovies,
    tvGenres,
    movieGenres,
  ] = await Promise.all([
    getAllTrending<Media>("day"),
    getTopRatedMovies<Media>(),
    getPopularMovies<Media>(),
    getTopRatedTv<Media>(),
    getUpcomingMovies<Media>(),
    getTvGenres<Genres>(),
    getMoviesGenres<Genres>(),
  ]);
  const genres = [...tvGenres.genres, ...movieGenres.genres];
  const featuredMovie = topRatedMovies.results[0];
  const featuredTrailerKey = await getTrailerKey("movie", featuredMovie.id);
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
        data={featuredMovie}
        genres={genres}
        mediaType="movie"
        trailerKey={featuredTrailerKey}
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
