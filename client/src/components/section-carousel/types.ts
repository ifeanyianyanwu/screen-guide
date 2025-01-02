import { Genre, Movie, TVShow } from "@/types/media";

export type MediaType = "tv" | "movie" | "person";
export type CarouselType = "overflow" | "compact";
export type CardType = "standard" | "detailed";
export type ItemsPerView = 2 | 4;

export interface SectionCarouselProps {
  carouselType?: CarouselType;
  cardType?: CardType;
  length?: number;
  data: Movie[] | TVShow[];
  itemsPerView?: ItemsPerView;
  genres: Genre[];
  sectionTitle: string;
  mediaType: MediaType;
}
