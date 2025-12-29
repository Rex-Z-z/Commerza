import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blue-accurate-gibbon-853.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
};

export default nextConfig;