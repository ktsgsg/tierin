import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 外部（ブラウザ）からリクエストされるパス
        source: '/storage/resources/:path*',
        // 内部のHono APIサーバーのURL
        destination: 'http://api:3000/storage/resources/:path*',
      }
    ];
  },
};

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

export default nextConfig;