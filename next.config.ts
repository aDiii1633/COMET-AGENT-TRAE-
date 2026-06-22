import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { webpack, isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
      };
      
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^node:/
        })
      );
    }
    return config;
  },
};

export default nextConfig;
