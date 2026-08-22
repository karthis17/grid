import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://picsum.photos/seed/**')],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
