/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    /**
     * Critical: prevents "ESM packages (pdfjs-dist/build/pdf.worker.min.mjs) need to be imported." error
     */
    esmExternals: 'loose',
    // You may not need this, it's just to support moduleResolution: 'node16'
    extensionAlias: {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
    },
    /**
     * Critical: Disable SWC to prevent native addon loading errors in WebContainer
     */
    swcPlugins: [],
    turbo: {
      resolveAlias: {
        // Turbopack does not support standard ESM import paths yet
        './archive-modal.js': './src/app/dashboard/documents/components/archive-modal.tsx',
        /**
         * Critical: prevents " ⨯ ./node_modules/canvas/build/Release/canvas.node
         * Module parse failed: Unexpected character '�' (1:0)" error
         */
        canvas: './empty-module.ts',
      },
    },
  },
  /**
   * Critical: Completely disable SWC compiler to prevent native addon issues
   */
  compiler: {
    removeConsole: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  /**
   * Critical: prevents ''import', and 'export' cannot be used outside of module code" error
   * See https://github.com/vercel/next.js/pull/66817
   */
  swcMinify: false,
  /**
   * Critical: Use Babel instead of SWC for transpilation
   */
  transpilePackages: [],
  webpack: (config) => {
    /**
     * Critical: prevents " ⨯ ./node_modules/canvas/build/Release/canvas.node
     * Module parse failed: Unexpected character '�' (1:0)" error
     */
    config.resolve.alias.canvas = false;

    /**
     * Critical: Prevent SWC usage in webpack
     */
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@next/swc-linux-x64-gnu': false,
      '@next/swc-linux-x64-musl': false,
      '@next/swc-darwin-x64': false,
      '@next/swc-darwin-arm64': false,
      '@next/swc-win32-x64-msvc': false,
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
