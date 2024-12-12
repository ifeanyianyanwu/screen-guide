"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for movies and TV shows
const mediaItems = [
  { id: 1, title: "Inception", year: 2010, type: "movie", isAdult: false },
  { id: 2, title: "Breaking Bad", year: 2008, type: "tv", isAdult: false },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    type: "movie",
    isAdult: false,
  },
  { id: 4, title: "Game of Thrones", year: 2011, type: "tv", isAdult: true },
  { id: 5, title: "Pulp Fiction", year: 1994, type: "movie", isAdult: true },
  { id: 6, title: "Stranger Things", year: 2016, type: "tv", isAdult: false },
  { id: 7, title: "The Matrix", year: 1999, type: "movie", isAdult: false },
  { id: 8, title: "The Crown", year: 2016, type: "tv", isAdult: false },
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mediaType, setMediaType] = useState("all");
  const [includeAdult, setIncludeAdult] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredMedia = mediaItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (mediaType === "all" || item.type === mediaType) &&
      (includeAdult || !item.isAdult)
  );

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="media-type" className="text-sm font-medium">
          Media Type
        </Label>
        <Select onValueChange={setMediaType} value={mediaType}>
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
      <div className="flex items-center space-x-2">
        <Switch
          id="adult-content"
          checked={includeAdult}
          onCheckedChange={setIncludeAdult}
        />
        <Label htmlFor="adult-content" className="text-sm font-medium">
          Include Adult Content
        </Label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <h1 className="mr-4 hidden md:inline-block text-xl font-bold">
            Media Search
          </h1>
          <div className="flex flex-1 items-center space-x-2">
            <div className="w-full md:w-[300px] lg:w-[400px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search movies and TV shows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-[300px] lg:w-[400px]">
            <div className="sticky top-[73px] pb-4">
              <h2 className="text-lg font-semibold mb-4 md:mb-6">Filters</h2>
              <FilterContent />
            </div>
          </aside>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Results</h2>
              <p className="text-sm text-muted-foreground">
                {filteredMedia.length} items found
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-2">
                      Year: {item.year}
                    </p>
                    <Badge
                      variant={item.type === "movie" ? "default" : "secondary"}
                    >
                      {item.type === "movie" ? "Movie" : "TV Show"}
                    </Badge>
                  </CardContent>
                  <CardFooter>
                    {item.isAdult && (
                      <Badge variant="destructive">Adult Content</Badge>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            {filteredMedia.length === 0 && (
              <p className="text-center text-muted-foreground mt-8">
                No media found matching your criteria.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
