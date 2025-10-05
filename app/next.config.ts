import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Copy local-data files to the output directory
    if (isServer) {
      config.plugins.push({
        apply: (compiler: any) => {
          compiler.hooks.afterEmit.tap('CopyLocalData', () => {
            const fs = require('fs');
            const path = require('path');
            const srcDir = path.join(process.cwd(), 'src', 'local-data');
            const destDir = path.join(process.cwd(), '.next', 'server', 'src', 'local-data');
            
            // Create destination directory if it doesn't exist
            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true });
            }
            
            // Copy all JSON files
            const files = fs.readdirSync(srcDir);
            files.forEach((file: string) => {
              const srcFile = path.join(srcDir, file);
              const destFile = path.join(destDir, file);
              fs.copyFileSync(srcFile, destFile);
            });
          });
        }
      });
    }
    return config;
  },
};

export default nextConfig;
