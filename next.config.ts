import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wfhorhkdbwfuxffbqifw.supabase.co',
        pathname: '/storage/v1/object/public/student-athlete-images/**'
      }
    ],
    domains: ['wfhorhkdbwfuxffbqifw.supabase.co'],
  },
};

export default nextConfig;
