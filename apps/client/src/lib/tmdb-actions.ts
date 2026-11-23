"use server";

// Server Actions used by the (client-side) search page, so the TMDB access
// token stays on the server instead of being shipped in the browser bundle.

import {
  getMoviesGenres,
  getTvGenres,
  searchAll,
  searchMovie,
  searchShow,
} from "@/api/tmdb";
import { Genre, Genres, Movie, TVShow } from "@/types/media";
import { Pagination } from "@/types/shared";

export type SearchMediaType = "movie" | "tv" | "all";

type RawSearchResults = {
  results: ((Movie | TVShow) & { media_type?: string })[];
} & Pagination;

export async function searchMediaAction(
  mediaType: SearchMediaType,
  query: string,
  includeAdult: boolean,
  page: number
): Promise<RawSearchResults> {
  const params = {
    query: String(query).slice(0, 200),
    include_adult: includeAdult === true,
    // TMDB only serves pages 1-500
    page: Math.min(Math.max(Math.trunc(Number(page)) || 1, 1), 500),
  };

  switch (mediaType) {
    case "movie":
      return searchMovie<RawSearchResults>(params);
    case "tv":
      return searchShow<RawSearchResults>(params);
    case "all":
      return searchAll<RawSearchResults>(params);
    default:
      throw new Error("Unsupported media type");
  }
}

export async function getGenresAction(): Promise<Genre[]> {
  const [tvGenres, movieGenres] = await Promise.all([
    getTvGenres<Genres>(),
    getMoviesGenres<Genres>(),
  ]);
  return [...tvGenres.genres, ...movieGenres.genres];
}
