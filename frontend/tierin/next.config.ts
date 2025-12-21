import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    }
  },
  async rewrites() {
    return [
      {
        // 外部（ブラウザ）からリクエストされるパス
        source: '/storage/resources/:path*',
        // 内部のHono APIサーバーのURL
        destination: process.env.NEXT_PUBLIC_API_URL + '/storage/resources/:path*',
      }
    ];
  },
  output: 'standalone',
};
export default nextConfig;