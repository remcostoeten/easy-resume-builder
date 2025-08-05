/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		optimizePackageImports: ['lucide-react'],
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
		deviceSizes: [320, 420, 768, 1024, 1200],
		imageSizes: [16, 32, 48, 64, 96],
		domains: [/* fill with audited hostnames */],
		// If non-static signed URLs are used, prefer remotePatterns instead of domains
		// Example remotePatterns for external images with path restrictions:
		// remotePatterns: [
		//   { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/my-app/**' },
		//   { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
		//   { protocol: 'https', hostname: 'avatars.githubusercontent.com', pathname: '/u/**' },
		// ],
	},
};

export default nextConfig;
