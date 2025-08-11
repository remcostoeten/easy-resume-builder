import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let selected = [];
try {
  const data = require('./perf/opi/packages.json');
  selected = Array.isArray(data) ? data.filter((x) => typeof x === 'string') : [];
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn('optimizePackageImports: packages.json not found or invalid, defaulting to []');
  selected = [];
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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
		ignoreDuringBuilds: false,
	},
	typescript: {
		ignoreBuildErrors: false,
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

export default nextConfig;
