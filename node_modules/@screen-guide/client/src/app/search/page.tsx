"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Loader2Icon,
  Filter,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getMoviesGenres, getTvGenres } from "@/api/tmdb";
import { Genre, Genres } from "@/types/media";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import { StandardCard } from "@/components/section-carousel/standard-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrlSync } from "@/hooks/use-url-sync";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const SkeletonCard = () => (
  <div className="space-y-3">
    <Skeleton className="rounded-lg aspect-video md:aspect-[3/4]" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(8)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default function SearchPage() {
  const [genres, setGenres] = useState<Genre[]>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { updateUrl, getInitialValue } = useUrlSync();

  const [currentPage, setCurrentPage] = useState(
    Number(getInitialValue("page", "1"))
  );
  const [searchTerm, setSearchTerm] = useState(getInitialValue("q"));
  const [mediaType, setMediaType] = useState(getInitialValue("type", "movie"));
  const [includeAdult, setIncludeAdult] = useState(
    getInitialValue("adult") === "true"
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, mediaType, includeAdult]);

  useEffect(() => {
    updateUrl({
      q: searchTerm,
      type: mediaType,
      adult: includeAdult.toString(),
      page: currentPage.toString(),
    });
  }, [searchTerm, mediaType, includeAdult, currentPage, updateUrl]);

  useEffect(() => {
    (async () => {
      try {
        const [tvGenres, movieGenres] = await Promise.all([
          getTvGenres<Genres>(),
          getMoviesGenres<Genres>(),
        ]);

        setGenres([...tvGenres.genres, ...movieGenres.genres]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const { searchResults, status } = useSearch(
    debouncedSearchTerm,
    mediaType,
    includeAdult,
    currentPage
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const FilterContent = useCallback(
    () => (
      <div className="p-6 space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="media-type" className="text-base font-semibold">
              Media Type
            </Label>
            <Select
              onValueChange={(value) => {
                setMediaType(value);
                setIsFilterOpen(false);
              }}
              value={mediaType}
            >
              <SelectTrigger id="media-type" className="w-full">
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between border rounded-lg p-4">
            <Label htmlFor="adult-content" className="text-base font-semibold">
              Include Adult Content
            </Label>
            <Switch
              id="adult-content"
              checked={includeAdult}
              onCheckedChange={(checked) => {
                setIncludeAdult(checked);
                setIsFilterOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    ),
    [setMediaType, setIncludeAdult, mediaType, includeAdult, setIsFilterOpen]
  );

  const Pagination = useCallback(
    ({
      currentPage,
      totalPages,
    }: {
      currentPage: number;
      totalPages: number;
    }) => {
      const canGoPrevious = currentPage > 1;
      const canGoNext = currentPage < totalPages;

      const renderPageButton = (pageNumber: number) => (
        <Button
          key={pageNumber}
          variant={currentPage === pageNumber ? "default" : "outline"}
          size="icon"
          onClick={() => handlePageChange(pageNumber)}
          className={`w-8 h-8 ${
            currentPage === pageNumber
              ? "bg-primary text-primary-foreground"
              : ""
          }`}
        >
          {pageNumber}
        </Button>
      );

      const renderPageButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
          for (let i = 1; i <= totalPages; i++) {
            buttons.push(renderPageButton(i));
          }
        } else {
          buttons.push(renderPageButton(1));

          if (currentPage > 3) {
            buttons.push(
              <Button
                key="start-ellipsis"
                variant="outline"
                size="icon"
                disabled
                className="w-8 h-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }

          const start = Math.max(2, currentPage - 1);
          const end = Math.min(totalPages - 1, currentPage + 1);

          for (let i = start; i <= end; i++) {
            buttons.push(renderPageButton(i));
          }

          if (currentPage < totalPages - 2) {
            buttons.push(
              <Button
                key="end-ellipsis"
                variant="outline"
                size="icon"
                disabled
                className="w-8 h-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }

          buttons.push(renderPageButton(totalPages));
        }

        return buttons;
      };

      return (
        <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!canGoPrevious}
              className="w-8 h-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="hidden sm:flex items-center gap-2">
              {renderPageButtons()}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!canGoNext}
              className="w-8 h-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">{currentPage}</span>{" "}
            of <span className="font-medium text-foreground">{totalPages}</span>
          </div>
        </nav>
      );
    },
    [handlePageChange]
  );

  console.log(searchResults);

  return (
    <div className="min-h-screen container mx-auto px-4 pt-28 md:pt-36 space-y-6 pb-8">
      <header className="w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 space-y-4">
        <h1 className="hidden md:inline-block text-center text-2xl font-bold w-full">
          Media Search
        </h1>
        <div className="container flex h-14 items-center gap-4 max-w-4xl mx-auto">
          <div className="flex flex-1 items-center space-x-2">
            <div className="w-full relative">
              {status === "loading" ? (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Loader2Icon className="animate-spin text-muted-foreground" />
                </span>
              ) : (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                type="text"
                placeholder="Search movies and TV shows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg h-10"
              />
            </div>
          </div>
          <div className="hidden gap-x-2 md:flex">
            <Select onValueChange={setMediaType} value={mediaType}>
              <SelectTrigger id="media-type" className="w-full h-10">
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="movie">Movies</SelectItem>
                <SelectItem value="tv">TV Shows</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <Switch
              id="adult-content"
              checked={includeAdult}
              onCheckedChange={setIncludeAdult}
            />
            <Label htmlFor="adult-content" className="text-sm font-medium">
              18+
            </Label>
          </div>
          <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="">
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
              </DrawerHeader>
              <FilterContent />
            </DrawerContent>
          </Drawer>
        </div>
      </header>
      <main className="container py-4 md:py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold">Results</h2>
              <p className="text-sm text-muted-foreground">
                {searchResults?.total_results || 0} items found
              </p>
            </div>
            {status === "loading" && <SkeletonGrid />}

            {status === "uninitialized" && (
              <p className="text-center text-muted-foreground mt-8">
                Start searching for movies and TV shows
              </p>
            )}

            {status === "error" && (
              <p className="text-center text-red-500 mt-8">
                An error occurred while fetching results. Please try again.
              </p>
            )}

            {status === "success" && (
              <>
                {searchResults && searchResults.results.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {searchResults.results.map((item) => (
                        <StandardCard
                          key={item.id}
                          media={item}
                          mediaType={item.media_type}
                          genres={genres!}
                          isInView={true}
                        />
                      ))}
                    </div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={searchResults.total_pages || 1}
                    />
                  </>
                ) : (
                  <p className="text-center text-muted-foreground mt-8">
                    No media found matching your criteria.
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
