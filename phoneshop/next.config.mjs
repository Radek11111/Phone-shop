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
  securityHeaders: [
    {
      key: "Content-Security-Policy",
      value: "script-src 'self' https://m.stripe.network 'unsafe-inline'",
    },
  ],
};

export default nextConfig;
