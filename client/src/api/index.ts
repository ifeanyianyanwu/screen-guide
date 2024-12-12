import { appConfig } from "@/lib/config";
import { SearchArgs } from "@/types/shared";
import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: appConfig.baseURL,
  headers: {
    Authorization: `Bearer ${appConfig.apiToken}`,
    Accept: "application/json",
  },
});

// Trending
export const getAllTrending = async <T>(timeWindow: string): Promise<T> => {
  const response = await apiClient.get(`trending/all/${timeWindow}`);
  return response.data;
};

// Movies
export const getMoviesGenres = async <T>(): Promise<T> => {
  const response = await apiClient.get("genre/movie/list");
  return response.data;
};

export const getUpcomingMovies = async <T>(): Promise<T> => {
  const response = await apiClient.get("movie/upcoming");
  return response.data;
};

export const getTopRatedMovies = async <T>(): Promise<T> => {
  const response = await apiClient.get("movie/top_rated");
  return response.data;
};

export const getPopularMovies = async <T>(): Promise<T> => {
  const response = await apiClient.get("movie/popular");
  return response.data;
};

export const getNowPlayingMovies = async () => {
  const response = await apiClient.get("movie/now_playing");
  return response.data;
};

export const getMovieDetails = async (id: number) => {
  const response = await apiClient.get(`movie/${id}`);
  return response.data;
};

export const getMovieCast = async (id: number) => {
  const response = await apiClient.get(`movie/${id}/credits`);
  return response.data;
};

export const getMovieTrailers = async (id: number) => {
  const response = await apiClient.get(`movie/${id}/videos`);
  return response.data;
};

export const getWatchProviders = async (id: number) => {
  const response = await apiClient.get(`movie/${id}/watch/providers`);
  return response.data;
};

export const getMovieReviews = async (id: number) => {
  const response = await apiClient.get(`movie/${id}/reviews`);
  return response.data;
};

export const getSimilarMovies = async (id: number) => {
  const response = await apiClient.get(`movie/${id}/similar`);
  return response.data;
};

// TV Shows
export const getTvDetails = async (id: number) => {
  const response = await apiClient.get(`tv/${id}`);
  return response.data;
};

export const getTvCast = async (id: number) => {
  const response = await apiClient.get(`tv/${id}/credits`);
  return response.data;
};

export const getTvTrailers = async (id: number) => {
  const response = await apiClient.get(`tv/${id}/videos`);
  return response.data;
};

export const getTvReviews = async (id: number) => {
  const response = await apiClient.get(`tv/${id}/reviews`);
  return response.data;
};

export const getSimilarShows = async (id: number) => {
  const response = await apiClient.get(`tv/${id}/similar`);
  return response.data;
};

export const getTvGenres = async <T>(): Promise<T> => {
  const response = await apiClient.get("genre/tv/list");
  return response.data;
};

export const getAiringTv = async <T>(): Promise<T> => {
  const response = await apiClient.get("tv/airing_today");
  return response.data;
};

export const getTvOnTheAir = async () => {
  const response = await apiClient.get("tv/on_the_air");
  return response.data;
};

export const getPopularTv = async () => {
  const response = await apiClient.get("tv/popular");
  return response.data;
};

export const getTopRatedTv = async () => {
  const response = await apiClient.get("tv/top_rated");
  return response.data;
};

// Configuration
export const getCountries = async () => {
  const response = await apiClient.get("configuration/countries");
  return response.data;
};

// Search
export const searchAll = async (args: SearchArgs) => {
  const response = await apiClient.get("search/multi", { params: args });
  return response.data;
};

export const searchMovie = async (args: SearchArgs) => {
  const response = await apiClient.get("search/movie", { params: args });
  return response.data;
};

export const searchShow = async (args: SearchArgs) => {
  const response = await apiClient.get("search/tv", { params: args });
  return response.data;
};
