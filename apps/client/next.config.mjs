/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
