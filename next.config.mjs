/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC minification for WebContainer/StackBlitz environments
  swcMinify: false,
  experimental: {
    /**
     * Critical: prevents "ESM packages (pdfjs-dist/build/pdf.worker.min.mjs) need to be imported." error
     */
    esmExternals: 'loose',
    // You may not need this, it's just to support moduleResolution: 'node16'
    extensionAlias: {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    /**
     * Critical: prevents " ⨯ ./node_modules/canvas/build/Release/canvas.node
     * Module parse failed: Unexpected character '�' (1:0)" error
     */
    config.resolve.alias.canvas = false;

    config.resolve.fallback = {
      ...config.resolve.fallback,
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
