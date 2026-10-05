import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The dev overlay is a development affordance and has nothing to render in a
  // production build, but it is switched off explicitly so the badge can never
  // be the thing that gets screenshotted into a portfolio. Off means fully off,
  // not repositioned: the position option would still show it.
  devIndicators: false,
};

export default nextConfig;
