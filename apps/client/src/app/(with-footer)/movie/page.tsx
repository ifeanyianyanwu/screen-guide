import {
  getMoviesGenres,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
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
  const trending = await getTrendingMovies<Media>("day");
  const nowPlaying = await getNowPlayingMovies<Media>();
  const popularMovies = await getPopularMovies<Media>();
  const topRatedMovies = await getTopRatedMovies<Media>();
  const upcomingMovies = await getUpcomingMovies<Media>();

  const movieGenres = await getMoviesGenres<Genres>();

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
        data={topRatedMovies.results[0]}
        genres={genres}
        mediaType="movie"
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
