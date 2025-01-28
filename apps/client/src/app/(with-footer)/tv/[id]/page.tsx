import {
  getMoviesGenres,
  getSimilarShows,
  getTvCredits,
  getTvDetails,
  getTvGenres,
  getTvReviews,
  getTvTrailers,
} from "@/api/tmdb";
import { SectionCarousel } from "@/components/section-carousel";
import { ToggleWatchlist } from "@/components/toggle-watchlist";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSession, getWatchlistStatus } from "@/lib/actions";
import { appConfig } from "@/lib/config";
import { formatDateTime, getYear } from "@/lib/utils";
import { Credits } from "@/types/credits";
import { Genres, TVShow, TVShowDetails } from "@/types/media";
import { Reviews } from "@/types/reviews";
import { Pagination } from "@/types/shared";
import { Trailers } from "@/types/trailers";
import { Play, Star, UserCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type TvShowDetailsPageProps = { params: { id: string } };
type Media = {
  results: TVShow[];
} & Pagination;

export default async function TvShowDetailsPage({
  params: { id },
}: TvShowDetailsPageProps) {
  const [
    details,
    credits,
    trailer,
    reviews,
    similar,
    tvGenres,
    movieGenres,
    session,
  ] = await Promise.all([
    getTvDetails<TVShowDetails>(Number(id)),
    getTvCredits<Credits>(Number(id)),
    getTvTrailers<Trailers>(Number(id)),
    getTvReviews<Reviews>(Number(id)),
    getSimilarShows<Media>(Number(id)),
    getTvGenres<Genres>(),
    getMoviesGenres<Genres>(),
    getSession(),
  ]);

  const { isInWatchList, watchlistItemId } = await getWatchlistStatus(
    session,
    id
  );

  const genres = [...tvGenres.genres, ...movieGenres.genres];
  const posterPath = details.poster_path
    ? `${appConfig.tmdbImageBaseURL}${details.poster_path}`
    : null;
  const backdropPath = details.backdrop_path
    ? `${appConfig.tmdbImageBaseURL}${details.backdrop_path}`
    : null;

  return (
    <main className="space-y-14 lg:space-y-20 lg:pb-20 pb-16 md:pb-24">
      <section className="relative min-h-svh grid place-items-center pt-14">
        <div className="absolute inset-0 bg-black/60 bg-blend-overlay -z-10 backdrop-blur-lg" />
        <Image
          src={backdropPath || ""}
          alt={details.name}
          fill
          className="absolute inset-0 object-cover -z-20"
          priority
        />
        <div className="container mx-auto px-4 py-20 flex flex-col lg:flex-row gap-14 md:gap-20 items-start">
          <div className="relative w-full max-w-[400px] mx-auto lg:mx-0">
            <Image
              src={posterPath || ""}
              alt={details.name}
              width={400}
              height={550}
              //TODO: Review this
              className="rounded-lg object-cover w-full hidden md:block"
              priority
            />
            <Image
              src={backdropPath || ""}
              alt={details.name}
              width={400}
              height={550}
              //TODO: Review this
              className="rounded-lg object-cover w-full md:hidden aspect-video"
              priority
            />
            <ToggleWatchlist
              isInWatchList={isInWatchList}
              session={session}
              media={{
                name: details.name,
                imageUrl: details.poster_path,
                rating: details.vote_average,
                releaseDate: String(details.first_air_date),
                type: "tv",
                mediaId: details.id,
                duration: undefined,
                _id: watchlistItemId,
              }}
            />
          </div>
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <div className="flex gap-2 items-center flex-wrap">
                {details.genres.map((g) => {
                  const resolvedGenreName = genres.find(
                    (item) => item.id == g.id
                  );
                  return resolvedGenreName ? (
                    <div key={id}>
                      <Badge className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-paragraph/90 text-sm">
                        {resolvedGenreName.name}
                      </Badge>
                    </div>
                  ) : undefined;
                })}
              </div>

              <h1 className="text-4xl font-bold text-white mb-2">
                {details.name}
              </h1>
              <div className="flex items-center gap-6 text-paragraph/70">
                <Badge
                  variant="outline"
                  className="bg-[#F3C53C] text-black border-0 font-bold text-base rounded-sm w-fit"
                >
                  {details.vote_average.toFixed(1)}
                </Badge>

                <span>{getYear(details.first_air_date)}</span>
                <span>{details.number_of_seasons}&nbsp;Season(s)</span>
              </div>
            </div>
            <p className="text-paragraph max-w-2xl md:text-lg">
              {details.overview}
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-paragraph">Starring:</span>
              {credits.cast.slice(0, 4).map((actor) => (
                <span key={actor.id} className="text-white">
                  {actor.name}
                </span>
              ))}
              <span>...</span>
              <Button variant="link" className="p-0">
                View Full Cast
              </Button>
            </div>
            <div className="flex gap-4">
              <Button
                className="relative overflow-hidden bg-red-600 group hover:bg-red-600"
                size="lg"
              >
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 
                     group-hover:w-[500px] group-hover:h-[500px] 
                     bg-white rounded-full 
                     transition-all duration-500 ease-in"
                />
                <span className="relative z-10 group-hover:text-black text-white transition-all delay-200 flex gap-x-2 text-base items-center ease-in">
                  Watch Now <Play className="mr-2 h-4 w-4" />
                </span>
              </Button>
              <a href="#more-details">
                <Button
                  size="lg"
                  variant="link"
                  className="text-base text-white"
                >
                  More Details
                </Button>
              </a>
            </div>
            {details.adult && (
              <Badge className="bg-foreground/10 hover:bg-foreground/10 backdrop-blur-lg text-paragraph/90 text-sm w-fit">
                18+
              </Badge>
            )}
          </div>
        </div>
      </section>
      <section className="scroll-mt-20" id="more-details">
        <div className="container px-4 mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            {details.tagline}
          </h2>
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${
                trailer.results.filter((result) => result.type === "Trailer")[0]
                  ?.key
              }`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          <div className="grid gap-8 mt-8 text-gray-300">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="flex-1">First aired</span>
                <span className="text-white flex-1">
                  {getYear(details.first_air_date)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="flex-1">Production Countries</span>
                <p className="text-white flex-1 flex flex-wrap gap-x-2">
                  {details.production_countries.map((country, i) => (
                    <span key={country.name} className="">
                      {country.name}
                      {details.production_countries.length - 1 !== i && ","}
                    </span>
                  ))}
                </p>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="flex-1">Production Companies</span>
                <p className="flex-1 text-white flex flex-wrap gap-x-2">
                  {details.production_companies.map((company, i) => (
                    <span className="" key={company.id}>
                      {company.name}
                      {details.production_companies.length - 1 !== i && ","}
                    </span>
                  ))}
                </p>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800 gap-4">
                <span className="flex-1">Genre</span>
                <p className="flex-1 text-white flex flex-wrap gap-x-2">
                  {details.genres.map((genre, index) => (
                    <span key={genre.id}>
                      {genre.name}
                      {index < details.genres.length - 1 && ","}
                    </span>
                  ))}
                </p>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="flex-1">Number of seasons</span>
                <span className="flex-1 text-white">
                  {details.number_of_seasons}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="flex-1">Number of episodes</span>
                <span className="flex-1 text-white">
                  {details.number_of_episodes}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="flex-1">Status</span>
                <span className="flex-1 text-white">{details.status}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="">
        <div className="container px-4 mx-auto max-w-3xl space-y-8">
          <h2 className="text-2xl font-bold text-white">Reviews</h2>
          <div className="space-y-8">
            {reviews.results.slice(0, 4).map((review) => {
              const imageSrc = review.author_details.avatar_path
                ? `${appConfig.tmdbImageBaseURL}${review.author_details.avatar_path}`
                : null;
              return (
                <div className="space-y-4" key={review.id}>
                  <div className="flex items-center gap-4">
                    {imageSrc ? (
                      <div className="w-10 h-10 relative rounded-full overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={review.author}
                          width={40}
                          height={40}
                          className="rounded-full object-cover aspect-square"
                        />
                      </div>
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-paragraph" />
                    )}
                    <div className="space-y-2">
                      <h3 className="text-white font-medium">
                        {review.author}
                      </h3>
                      <div className="flex gap-4 items-center">
                        <span className="flex gap-1 items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <p className="text-white text-sm">
                            {review.author_details.rating}
                          </p>
                        </span>
                        <p className="text-sm text-gray-400">
                          {formatDateTime(review.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 line-clamp-3">{review.content}</p>
                </div>
              );
            })}
          </div>
          <div>
            <Link href={`https://www.themoviedb.org/movie/${id}/reviews`}>
              <Button variant="link" className="text-white p-0 text-base">
                See all reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="">
        <SectionCarousel
          genres={genres}
          data={similar.results}
          sectionTitle="Related Tv Shows"
          mediaType="tv"
        />
      </section>
    </main>
  );
}
