/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  // Allow cross-origin requests from devices on local network during development
  allowedDevOrigins: ['http://172.20.10.2:3000'],
  output: 'standalone',
};

module.exports = nextConfig;
