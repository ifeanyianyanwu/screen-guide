import { searchMediaAction, SearchMediaType } from "@/lib/tmdb-actions";
import { Movie, TVShow } from "@/types/media";
import { Pagination } from "@/types/shared";
import { useEffect, useState } from "react";

interface IMovie extends Movie {
  media_type: "movie";
}

interface ITVShow extends TVShow {
  media_type: "tv";
}

export type SearchResults = {
  results: (IMovie | ITVShow)[];
} & Pagination;

const isSearchMediaType = (value: string): value is SearchMediaType =>
  value === "movie" || value === "tv" || value === "all";

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

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults(undefined);
      setStatus("uninitialized");
      return;
    }

    // Ignore responses from searches that have been superseded, so a slow
    // earlier request can't overwrite the results of a newer one.
    let ignore = false;
    const type = isSearchMediaType(mediaType) ? mediaType : "movie";

    setStatus("loading");

    searchMediaAction(type, searchTerm, includeAdult, currentPage)
      .then((res) => {
        if (ignore) return;

        const results = res.results
          .map((item) => ({
            ...item,
            // search/movie and search/tv don't include media_type; search/multi
            // does (and can also return people, which we have no page for).
            media_type: type === "all" ? item.media_type : type,
          }))
          .filter(
            (item): item is IMovie | ITVShow =>
              item.media_type === "movie" || item.media_type === "tv"
          );

        setSearchResults({ ...res, results });
        setStatus("success");
      })
      .catch((error) => {
        if (ignore) return;
        console.error(error);
        setStatus("error");
      });

    return () => {
      ignore = true;
    };
  }, [searchTerm, mediaType, includeAdult, currentPage]);

  return { searchResults, status };
};
