import "server-only";
import { serverConfig } from "@/lib/server-config";
import { SearchArgs } from "@/types/shared";
import { Trailers } from "@/types/trailers";

// TMDB data changes slowly, so responses are cached in Next's Data Cache and
// revalidated in the background. This keeps TTFB low on the (dynamic) pages
// without serving stale data for long.
const ONE_HOUR = 60 * 60;
const ONE_DAY = 24 * ONE_HOUR;

type QueryParams = Record<string, string | number | boolean | undefined>;

type FetchOptions = {
  params?: QueryParams;
  // seconds, or `false` to skip the Data Cache entirely
  revalidate?: number | false;
};

const tmdbGet = async <T>(
  path: string,
  { params, revalidate = ONE_HOUR }: FetchOptions = {}
): Promise<T> => {
  // Trailing slash so relative paths are appended to the base path (e.g. /3/).
  const baseURL = serverConfig.tmdbBaseURL.replace(/\/?$/, "/");
  const url = new URL(path, baseURL);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${serverConfig.tmdbApiToken}`,
      Accept: "application/json",
    },
    ...(revalidate === false
      ? { cache: "no-store" as const }
      : { next: { revalidate } }),
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request to "${path}" failed with status ${response.status}`
    );
  }

  return response.json() as Promise<T>;
};

// Trending
export const getAllTrending = <T>(timeWindow: string) =>
  tmdbGet<T>(`trending/all/${timeWindow}`);

// Movies
export const getTrendingMovies = <T>(timeWindow: string) =>
  tmdbGet<T>(`trending/movie/${timeWindow}`);

export const getMoviesGenres = <T>() =>
  tmdbGet<T>("genre/movie/list", { revalidate: ONE_DAY });

export const getUpcomingMovies = <T>() => tmdbGet<T>("movie/upcoming");

export const getTopRatedMovies = <T>() => tmdbGet<T>("movie/top_rated");

export const getPopularMovies = <T>() => tmdbGet<T>("movie/popular");

export const getNowPlayingMovies = <T>() => tmdbGet<T>("movie/now_playing");

export const getMovieDetails = <T>(id: number) => tmdbGet<T>(`movie/${id}`);

export const getMovieCredits = <T>(id: number) =>
  tmdbGet<T>(`movie/${id}/credits`);

export const getMovieTrailers = <T>(id: number) =>
  tmdbGet<T>(`movie/${id}/videos`);

export const getWatchProviders = <T>(id: number) =>
  tmdbGet<T>(`movie/${id}/watch/providers`);

export const getMovieReviews = <T>(id: number) =>
  tmdbGet<T>(`movie/${id}/reviews`);

export const getSimilarMovies = <T>(id: number) =>
  tmdbGet<T>(`movie/${id}/similar`);

// TV Shows
export const getTrendingTvShows = <T>(timeWindow: string) =>
  tmdbGet<T>(`trending/tv/${timeWindow}`);

export const getTvDetails = <T>(id: number) => tmdbGet<T>(`tv/${id}`);

export const getTvCredits = <T>(id: number) => tmdbGet<T>(`tv/${id}/credits`);

export const getTvTrailers = <T>(id: number) => tmdbGet<T>(`tv/${id}/videos`);

export const getTvReviews = <T>(id: number) => tmdbGet<T>(`tv/${id}/reviews`);

export const getSimilarShows = <T>(id: number) =>
  tmdbGet<T>(`tv/${id}/similar`);

export const getTvGenres = <T>() =>
  tmdbGet<T>("genre/tv/list", { revalidate: ONE_DAY });

export const getAiringTv = <T>() => tmdbGet<T>("tv/airing_today");

export const getTvOnTheAir = <T>() => tmdbGet<T>("tv/on_the_air");

export const getPopularTv = <T>() => tmdbGet<T>("tv/popular");

export const getTopRatedTv = <T>() => tmdbGet<T>("tv/top_rated");

// Configuration
export const getCountries = <T>() =>
  tmdbGet<T>("configuration/countries", { revalidate: ONE_DAY });

// Search (user-driven, not worth caching)
export const searchAll = <T>(args: SearchArgs) =>
  tmdbGet<T>("search/multi", { params: args, revalidate: false });

export const searchMovie = <T>(args: SearchArgs) =>
  tmdbGet<T>("search/movie", { params: args, revalidate: false });

export const searchShow = <T>(args: SearchArgs) =>
  tmdbGet<T>("search/tv", { params: args, revalidate: false });

/**
 * Returns the YouTube key of the first official "Trailer" video for a movie
 * or TV show, or `undefined` when there is none or the request fails (the
 * trailer is a non-critical enhancement, it must never break the page).
 */
export const getTrailerKey = async (
  mediaType: "movie" | "tv",
  id: number
): Promise<string | undefined> => {
  try {
    const trailers =
      mediaType === "movie"
        ? await getMovieTrailers<Trailers>(id)
        : await getTvTrailers<Trailers>(id);
    return trailers.results.find((result) => result.type === "Trailer")?.key;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
