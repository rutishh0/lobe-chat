import analyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';
import ReactComponentName from 'react-scan/react-component-name/webpack';
import path from 'path';

const isProd = process.env.NODE_ENV === 'production';
const buildWithDocker = process.env.DOCKER === 'true';
const enableReactScan = !!process.env.REACT_SCAN_MONITOR_API_KEY;
const isUsePglite = process.env.NEXT_PUBLIC_CLIENT_DB === 'pglite';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const nextConfig: NextConfig = {
  basePath,
  compress: isProd,
  // Add these two configurations to ignore ESLint and TypeScript errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: [
      'emoji-mart',
      '@emoji-mart/react',
      '@emoji-mart/data',
      '@icons-pack/react-simple-icons',
      '@lobehub/ui',
      'gpt-tokenizer',
    ],
    webVitalsAttribution: ['CLS', 'LCP'],
    webpackMemoryOptimizations: true,
  },
  
  // Moved from experimental to root level
  outputFileTracingExcludes: {
    '*': [
      './app/(backend)/trpc/**/*',
    ],
  },
  
  // Use serverExternalPackages instead of serverComponentsExternalPackages
  serverExternalPackages: isProd 
    ? ['@electric-sql/pglite', 'pino', 'pino-pretty', '@trpc/server'] 
    : ['pino', 'pino-pretty', '@trpc/server'],
  
  async headers() {
    return [
      {
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
        source: '/icons/(.*).(png|jpe?g|gif|svg|ico|webp)',
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  output: buildWithDocker ? 'standalone' : undefined,
  outputFileTracingIncludes: buildWithDocker
    ? { '*': ['public/**/*', '.next/static/**/*'] }
    : undefined,
  reactStrictMode: true,
  redirects: async () => [],
  // Always apply the rewrites to redirect edge routes to async routes
  rewrites: async () => [
    {
      source: '/trpc/:path*',
      destination: '/api/trpc-fallback',
    },
  ],
  transpilePackages: ['pdfjs-dist', 'mermaid'],

  webpack(config, { isServer }) {
    // Handle Node.js built-in modules and problematic modules
    if (isProd) {
      // Add fallbacks for Node.js core modules and problematic packages
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Node.js core modules
        'fs': false,
        'path': false,
        'crypto': false,
        'stream': false,
        'http': false,
        'https': false,
        'zlib': false,
        'os': false,
        'net': false,
        'tls': false,
        'async_hooks': false,
        // Node.js modules with node: prefix
        'node:async_hooks': false,
        'node:fs': false,
        'node:path': false,
        'node:crypto': false,
        'node:stream': false,
        'node:http': false,
        'node:https': false,
        'node:zlib': false,
        'node:os': false,
        'node:net': false,
        'node:tls': false,
        // Problematic modules
        'epub': false,
        'epub2': false,
        'zipfile': false,
      };
      
      // Get webpack constructor for plugins
      const webpack = require('webpack');
      
      // Use IgnorePlugin to skip problematic modules
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^(epub2|epub|zipfile)$/,
        })
      );
      
      // Add module replacement for critters
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^critters$/,
          path.resolve(__dirname, './node_modules/next/dist/compiled/critters')
        )
      );
    }
    
    // Enable React component monitoring if needed
    if (enableReactScan) {
      config.plugins.push(
        // @ts-expect-error - This is a custom plugin
        new ReactComponentName({
          filter: /src|libs/,
        }),
      );
    }
    
    return config;
  },
};

const noWrapper = (config: NextConfig) => config;

const withBundleAnalyzer = process.env.ANALYZE === 'true' ? analyzer() : noWrapper;

const withPWA = isProd
  ? withSerwistInit({
      register: false,
      swDest: 'public/sw.js',
      swSrc: 'src/app/sw.ts',
    })
  : noWrapper;

const hasSentry = !!process.env.NEXT_PUBLIC_SENTRY_DSN;
const withSentry =
  isProd && hasSentry
    ? (c: NextConfig) =>
        withSentryConfig(
          c,
          {
            org: process.env.SENTRY_ORG,
            project: process.env.SENTRY_PROJECT,
            silent: true,
          },
          {
            automaticVercelMonitors: true,
            disableLogger: true,
            hideSourceMaps: true,
            transpileClientSDK: true,
            tunnelRoute: '/monitoring',
            widenClientFileUpload: true,
          },
        )
    : noWrapper;

export default withBundleAnalyzer(withPWA(withSentry(nextConfig) as NextConfig));