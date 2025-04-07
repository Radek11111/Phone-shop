/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.example.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
