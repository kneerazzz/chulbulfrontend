import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',                        // frontend route
        destination: 'https://chulbulproject.onrender.com/api/v1/:path*', // backend URL
      },
    ]
  },
};

export default nextConfig;
