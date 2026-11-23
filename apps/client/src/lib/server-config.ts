import "server-only";

// Server-only configuration. Importing this module from a Client Component
// fails the build (via `server-only`), so these values can never be shipped
// to the browser. None of these variables may use the NEXT_PUBLIC_ prefix.
export const serverConfig = {
  tmdbBaseURL: process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3",
  tmdbApiToken: process.env.TMDB_API_TOKEN,
  serverBaseUrl:
    process.env.SERVER_BASE_URL ||
    process.env.NEXT_PUBLIC_SERVER_BASE_URL ||
    "http://localhost:8080",
  serverJwtSecret: process.env.SERVER_JWT_SECRET,
};
