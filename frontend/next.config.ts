import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lnysnylnrgnomhtyyjir.supabase.co",
      },
    ],
  },
};

export default nextConfig;
