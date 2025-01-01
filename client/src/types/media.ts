export type TrendingMedia = {
  backdrop_path: string;
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv";
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date?: Date;
  first_air_date?: Date;
  video?: boolean;
  vote_average: number;
  vote_count: number;
  origin_country?: string[];
};

export type Genre = {
  id: number;
  name: string;
};

export type Genres = { genres: Genre[] };

// Shared interfaces between movies and TV shows
interface MediaDetailsBase {
  adult: boolean;
  backdrop_path: string;
  genres: Genre[];
  homepage: string;
  id: number;
  origin_country: string[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
}

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

// Movie Details specific interfaces
interface Collection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface MovieDetails extends MediaDetailsBase {
  belongs_to_collection: Collection;
  budget: number;
  imdb_id: string;
  original_title: string;
  release_date: Date;
  revenue: number;
  runtime: number;
  title: string;
  video: boolean;
}

// TV Details Show-specific interfaces
interface Creator {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string;
}

interface Network {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface TVShowDetails extends MediaDetailsBase {
  created_by: Creator[];
  episode_run_time: number[];
  first_air_date: Date;
  in_production: boolean;
  languages: string[];
  last_air_date: Date;
  last_episode_to_air: Episode;
  name: string;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  original_name: string;
  seasons: Season[];
  type: string;
}

// Indvidual media item interfaces
interface Media {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv";
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface Movie extends Media {
  title: string;
  original_title: string;
  release_date: Date;
  video: boolean;
}

export interface TVShow extends Media {
  name: string;
  original_name: string;
  first_air_date: Date;
  origin_country: string[];
}
