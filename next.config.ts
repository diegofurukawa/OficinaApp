import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Para Docker e Vercel
  output: 'standalone',
  
  // Configurações de build
  experimental: {
    outputFileTracingRoot: undefined,
  },
  
  // Configurações do banco SQLite
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Para better-sqlite3 funcionar no Docker
      config.externals.push('better-sqlite3');
    }
    return config;
  },
};

export default nextConfig;