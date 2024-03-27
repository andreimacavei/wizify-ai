/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/demo",
        destination: "/index.html",
      },
    ];
  },
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

    return config;
  },
};

export default nextConfig;
