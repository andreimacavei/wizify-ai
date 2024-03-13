/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/demo',
        destination: '/index.html',
      },
    ];
  },
};

export default nextConfig;
