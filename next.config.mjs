/** @type {import('next').NextConfig} */

const nextConfig = {
	experimental: {
		// Enable optimized package imports for tree shaking
		optimizePackageImports: [
			'lucide-react',
			// Only keep actually used Radix UI components
			'@radix-ui/react-accordion',
			'@radix-ui/react-alert-dialog',
			'@radix-ui/react-dialog',
			'@radix-ui/react-label',
			'@radix-ui/react-progress',
			'@radix-ui/react-select',
			'@radix-ui/react-separator',
			'@radix-ui/react-slider',
			'@radix-ui/react-slot',
			'@radix-ui/react-switch',
			'@radix-ui/react-toggle',
			'@radix-ui/react-toggle-group',
			'@radix-ui/react-tooltip',
			'framer-motion',
			'recharts',
			'date-fns',
			'sonner',
			'react-hook-form',
			'zod',
			'@hookform/resolvers',
			'clsx',
			'class-variance-authority',
			'tailwind-merge',
			'react-query',
			'@tanstack/react-query',
			'axios',
			'lodash-es',
			'@apollo/client',
			'graphql',
			'react-router-dom',
			'react-select',
			'react-table',
			'@tanstack/react-table',
		],
		// Enable CSS optimization
		optimizeCss: true,
		// Enable Turbo features (if using Turbo)
		turbo: {
			rules: {
				'*.svg': {
					loaders: ['@svgr/webpack'],
					as: '*.js',
				},
			},
		},
	},
	transpilePackages: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
	eslint: {
		ignoreDuringBuilds: false,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [320, 420, 768, 1024, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		domains: [],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
			},
		],
		dangerouslyAllowSVG: false,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	// Enable webpack optimizations
	webpack: (config, { dev, isServer, webpack }) => {
		if (!dev && !isServer) {
			// Enable module concatenation for better performance
			config.optimization.concatenateModules = true;
			
			// Optimize module IDs for better caching
			config.optimization.moduleIds = 'deterministic';
			config.optimization.chunkIds = 'deterministic';
			
			// Optimize chunks for better caching
			config.optimization.splitChunks = {
				...config.optimization.splitChunks,
				chunks: 'all',
				minSize: 20000,
				maxSize: 244000,
				cacheGroups: {
					...config.optimization.splitChunks.cacheGroups,
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
						priority: 10,
						enforce: true,
					},
					radix: {
						test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
						name: 'radix-ui',
						chunks: 'all',
						priority: 30,
						enforce: true,
					},
					framer: {
						test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
						name: 'framer-motion',
						chunks: 'all',
						priority: 25,
						enforce: true,
					},
					recharts: {
						test: /[\\/]node_modules[\\/]recharts[\\/]/,
						name: 'recharts',
						chunks: 'all',
						priority: 25,
						enforce: true,
					},
					utils: {
						test: /[\\/]node_modules[\\/](clsx|class-variance-authority|tailwind-merge|cn)[\\/]/,
						name: 'utils',
						chunks: 'all',
						priority: 20,
						enforce: true,
					},
					forms: {
						test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
						name: 'forms',
						chunks: 'all',
						priority: 20,
						enforce: true,
					},
					query: {
						test: /[\\/]node_modules[\\/](@tanstack\/react-query|react-query|@apollo\/client)[\\/]/,
						name: 'query',
						chunks: 'all',
						priority: 20,
						enforce: true,
					},
					dateFns: {
						test: /[\\/]node_modules[\\/]date-fns[\\/]/,
						name: 'date-fns',
						chunks: 'all',
						priority: 15,
						enforce: true,
					},
					lodash: {
						test: /[\\/]node_modules[\\/]lodash[\\/]/,
						name: 'lodash',
						chunks: 'all',
						priority: 15,
						enforce: true,
					},
				},
			};
		}
		
		// Optimize imports
		config.resolve.alias = {
			...config.resolve.alias,
			'@': './src',
		};
		
		// No special handling needed with dynamic imports
		
		return config;
	},
	// Headers for better caching and security
	async headers() {
		return [
			{
				source: '/_next/static/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			{
				source: '/favicon.ico',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=86400',
					},
				],
			},
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
					...(process.env.NODE_ENV === 'production' ? [
						{
							key: 'Strict-Transport-Security',
							value: 'max-age=63072000; includeSubDomains; preload',
						},
					] : []),
				],
			},
		];
	},
	// Output configuration
	output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
	// Enable compression
	compress: true,
	// Disable x-powered-by header for security
	poweredByHeader: false,
	// Enable strict mode
	reactStrictMode: true,
	// Disable ETags if using CDN
	generateEtags: false,
	// Optimize page loading
	onDemandEntries: {
		// Period (in ms) where the server will keep pages in the buffer
		maxInactiveAge: 25 * 1000,
		// Number of pages that should be kept simultaneously without being disposed
		pagesBufferLength: 2,
	},
	// Compiler options
	compiler: {
		// Remove console.log in production
		removeConsole: process.env.NODE_ENV === 'production' ? {
			exclude: ['error', 'warn'],
		} : false,
	},
	// Enable modern JavaScript features
	target: 'server',
};

// Export the configuration
export default nextConfig;
