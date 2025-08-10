import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import bundleAnalyzer from '@next/bundle-analyzer';
import selected from './perf/opi/packages.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ANALYZE_FLAG =
  process.env.ANALYZE === 'true' ||
  process.env.ANALYZE === '1' ||
  process.env.ANALYZE_BUILD === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		optimizePackageImports: selected,
	},

	webpack: (config, { dev, isServer }) => {
		// Fix for webpack module loading issues
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
			};
		}

		// Better tree-shaking in production
		if (!dev) {
			config.optimization.usedExports = true;
			config.optimization.sideEffects = false;
		}

		// Prevent webpack from mangling function names in development
		if (dev) {
			config.optimization = {
				...config.optimization,
				minimizer: [],
			};
		}

		return config;
	},

	// Optimize package transpilation
	transpilePackages: [
		'@dnd-kit/core', 
		'@dnd-kit/sortable', 
		'@dnd-kit/utilities'
	],

	// Strict mode for better development experience
	eslint: {
		ignoreDuringBuilds: ANALYZE_FLAG,
	},
	typescript: {
		ignoreBuildErrors: ANALYZE_FLAG,
	},

	// Advanced image optimization
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [320, 420, 768, 1024, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256],
		minimumCacheTTL: 31536000, // 1 year
		dangerouslyAllowSVG: true,
		contentDispositionType: 'attachment',
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
		domains: [],
	},

	// Security headers
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin',
					},
				],
			},
		];
	},
};

const withBundleAnalyzer = bundleAnalyzer({ enabled: ANALYZE_FLAG });

export default withBundleAnalyzer(nextConfig);
