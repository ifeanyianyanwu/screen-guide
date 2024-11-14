export type Pagination = {
  page: number;
  total_pages: number;
  total_results: number;
};

export type SearchArgs = {
  query: string;
  include_adult: boolean;
  primary_release_year?: string;
  first_air_date_year?: string;
};
