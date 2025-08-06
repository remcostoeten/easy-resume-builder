/** @type {import('next').NextConfig} */
const nextConfig = {
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

		// Prevent webpack from mangling function names in development
		if (dev) {
			config.optimization = {
				...config.optimization,
				minimizer: [],
			};
		}

		return config;
	},
	transpilePackages: [
		'@dnd-kit/core', 
		'@dnd-kit/sortable', 
		'@dnd-kit/utilities'
	],
	eslint: {
		ignoreDuringBuilds: false,
	},
	typescript: {
		ignoreBuildErrors: false,
	},
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [320, 420, 768, 1024, 1200],
		imageSizes: [16, 32, 48, 64, 96],
		domains: [],
	},
};

export default nextConfig;
