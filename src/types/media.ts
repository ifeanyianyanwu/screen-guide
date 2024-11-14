export type TrendingMediaItem = {
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
