// Client-safe configuration only. Everything in this file can end up in the
// browser bundle, so never add secrets here. Server-only values live in
// `@/lib/server-config`.

const DEFAULT_TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export const appConfig = {
  tmdbImageBaseURL:
    process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || DEFAULT_TMDB_IMAGE_BASE_URL,
};

// TMDB image sizes we use (see https://developer.themoviedb.org/docs/image-basics).
export type TmdbImageSize =
  | "w185"
  | "w342"
  | "w500"
  | "w780"
  | "w1280"
  | "original";

/**
 * Builds a TMDB image URL for the requested size. The configured base URL is
 * expected to look like `https://image.tmdb.org/t/p/<size>`; its size segment
 * is swapped for `size` so we don't pull multi-megabyte "original" files when
 * a smaller rendition is enough.
 */
export function tmdbImage(
  path: string | null | undefined,
  size: TmdbImageSize = "original"
): string | null {
  if (!path) return null;

  const base = appConfig.tmdbImageBaseURL.replace(/\/+$/, "");
  let sizedBase = base;
  if (/\/t\/p$/.test(base)) {
    sizedBase = `${base}/${size}`;
  } else if (/\/t\/p\/[^/]+$/.test(base)) {
    sizedBase = base.replace(/\/t\/p\/[^/]+$/, `/t/p/${size}`);
  }

  return `${sizedBase}${path.startsWith("/") ? path : `/${path}`}`;
}
