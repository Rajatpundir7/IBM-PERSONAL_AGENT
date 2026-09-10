/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone", // Required for Docker multi-stage build
  env: {
    IBM_PROJECT_ID: process.env.IBM_PROJECT_ID,
  },
};

module.exports = nextConfig;
