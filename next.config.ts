import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import path from "node:path";

const nextConfig = (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;
  const isStaticExport = process.env.OUTPUT_EXPORT === "true";

  return {
    ...(isStaticExport ? { output: "export" } : {}),
    compress: true,
    images: {
      formats: ["image/avif", "image/webp"],
      ...(isStaticExport ? { unoptimized: true } : {}),
      deviceSizes: [640, 750, 828, 1080, 1200, 1920],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    },
    turbopack: {
      resolveAlias: {
        "next/dist/build/polyfills/polyfill-module": "./lib/empty-polyfill.js",
      },
    },
    webpack(config) {
      config.resolve = config.resolve || {};
      config.resolve.alias = config.resolve.alias || {};
      config.resolve.alias["next/dist/build/polyfills/polyfill-module"] = path.resolve(
        __dirname,
        "lib/empty-polyfill.js"
      );
      return config;
    },
    ...(isDev || isStaticExport
      ? {}
      : {
          async redirects() {
            return [
              {
                source: "/works",
                destination: "/work",
                permanent: true,
              },
            ];
          },
          async headers() {
            return [
              {
                source: "/frames/:path*",
                headers: [
                  {
                    key: "Cache-Control",
                    value: "public, max-age=31536000, immutable",
                  },
                ],
              },
              {
                source: "/gallery/:path*",
                headers: [
                  {
                    key: "Cache-Control",
                    value: "public, max-age=31536000, immutable",
                  },
                ],
              },
              {
                source: "/clients/:path*",
                headers: [
                  {
                    key: "Cache-Control",
                    value: "public, max-age=31536000, immutable",
                  },
                ],
              },
              {
                source: "/:path*.(ico|png|jpg|jpeg|webp|avif|svg|woff2|woff|ttf|mp4)",
                headers: [
                  {
                    key: "Cache-Control",
                    value: "public, max-age=31536000, immutable",
                  },
                ],
              },
            ];
          },
        }),
  };
};

export default nextConfig;
