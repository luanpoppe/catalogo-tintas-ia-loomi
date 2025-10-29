/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidaileapiprodscus.blob.core.windows.net",
        port: "",
        pathname: "/private/**",
      },
    ],
  },
};

export default nextConfig;
