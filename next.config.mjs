/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable ES modules support
  experimental: {
    esmExternals: true,
  },
  // Optimize images
  images: {
    domains: ['www.notion.so', 's3.us-west-2.amazonaws.com'],
  },
}

export default nextConfig
