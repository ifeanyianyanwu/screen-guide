export interface Reviews {
  id: number;
  page: number;
  results: Review[];
}

interface Review {
  author: string;
  author_details: AuthorDetails;
  content: string;
  created_at: Date; // ISO 8601 date string
  id: string;
  updated_at: Date; // ISO 8601 date string
  url: string;
}

interface AuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null; // Nullable if no avatar provided
  rating: number | null; // Nullable if no rating provided
}
