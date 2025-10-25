/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
}

export default nextConfig
