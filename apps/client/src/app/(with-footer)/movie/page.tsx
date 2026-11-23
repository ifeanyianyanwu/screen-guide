import {
  getMoviesGenres,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getTrailerKey,
  getTrendingMovies,
  getUpcomingMovies,
} from "@/api/tmdb";
import { HeroCarousel } from "@/components/hero-carousel";
import MovieCardSection from "@/components/movie-card-section";
import { SectionCarousel } from "@/components/section-carousel";
import { Genres, Movie } from "@/types/media";
import { Pagination } from "@/types/shared";
import React from "react";

type Media = {
  results: Movie[];
} & Pagination;

export default async function MoviePage() {
  const [
    trending,
    nowPlaying,
    popularMovies,
    topRatedMovies,
    upcomingMovies,
    movieGenres,
  ] = await Promise.all([
    getTrendingMovies<Media>("day"),
    getNowPlayingMovies<Media>(),
    getPopularMovies<Media>(),
    getTopRatedMovies<Media>(),
    getUpcomingMovies<Media>(),
    getMoviesGenres<Genres>(),
  ]);
  const featuredMovie = topRatedMovies.results[0];
  const featuredTrailerKey = await getTrailerKey("movie", featuredMovie.id);

  const genres = movieGenres.genres;
  const mediaType = "movie";

  return (
    <main className="overflow-hidden space-y-14 lg:space-y-20 pb-16 md:pb-24">
      <HeroCarousel genres={genres} data={trending} />

      <SectionCarousel
        sectionTitle="Now Playing"
        genres={genres}
        data={nowPlaying.results}
        mediaType={mediaType}
      />
      <SectionCarousel
        sectionTitle="Popular Movies"
        genres={genres}
        data={popularMovies.results}
        carouselType="overflow"
        mediaType={mediaType}
      />

      <SectionCarousel
        sectionTitle="Top Rated Movies"
        genres={genres}
        data={topRatedMovies.results.slice(1)}
        itemsPerView={2}
        cardType="detailed"
        mediaType={mediaType}
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
        mediaType={mediaType}
      />
    </main>
  );
}
