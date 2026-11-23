/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // AVIF is ~20-30% smaller than WebP for photos; browsers without AVIF get WebP.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        // Any TMDB size (w185, w342, w500, w780, w1280, original, ...).
        pathname: "/t/p/**",
      },
    ],
  },
};

export default nextConfig;
