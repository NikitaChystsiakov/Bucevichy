import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // В демо готова только страница свадеб, главная ведёт на неё
  async redirects() {
    return [{ source: "/", destination: "/svadby", permanent: false }];
  },
};

export default nextConfig;
