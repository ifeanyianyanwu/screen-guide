import { searchMovie, searchShow } from "@/api/tmdb";
import { Movie, TVShow } from "@/types/media";
import { Pagination } from "@/types/shared";
import { useCallback, useEffect, useState } from "react";

interface IMovie extends Movie {
  media_type: "movie";
}

interface ITVShow extends TVShow {
  media_type: "movie";
}

interface IPerson extends TVShow, Movie {
  media_type: "person";
}

export type SearchResults = {
  results: IMovie[] | ITVShow[] | IPerson[];
} & Pagination;

export const useSearch = (
  searchTerm: string,
  mediaType: string,
  includeAdult: boolean,
  currentPage: number
) => {
  const [searchResults, setSearchResults] = useState<SearchResults>();
  const [status, setStatus] = useState<
    "uninitialized" | "loading" | "success" | "error"
  >("uninitialized");

  const performSearch = useCallback(async () => {
    if (!searchTerm) {
      setSearchResults(undefined);
      setStatus("uninitialized");
      return;
    }

    setStatus("loading");

    try {
      let res;
      const params = {
        include_adult: includeAdult,
        query: searchTerm,
        page: currentPage,
      };

      switch (mediaType) {
        case "movie": {
          res = await searchMovie<SearchResults>(params);
          const transformedResults = res.results.map((show) => ({
            ...show,
            media_type: "movie",
          }));
          res = { ...res, results: transformedResults } as SearchResults;
          break;
        }
        case "tv": {
          res = await searchShow<SearchResults>(params);
          const transformedResults = res.results.map((show) => ({
            ...show,
            media_type: "movie",
          }));
          res = { ...res, results: transformedResults } as SearchResults;
          break;
        }
      }

      setSearchResults(res);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }, [searchTerm, mediaType, includeAdult, currentPage]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  return { searchResults, status };
};
