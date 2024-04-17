/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
  webpack(config) {
    config.experiments ??= {};
    config.experiments.asyncWebAssembly = true;
    // config.experiments.topLevelAwait = true;
    // config.resolve.fallback = {
    //   crypto: false,
    // };
    return config;
  },
};

export default nextConfig;
