import { NextConfig } from "next";

const nextConfig = {
  // Remove rewrites - use proxy routes instead
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  }
};


export default nextConfig