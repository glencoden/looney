import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactCompiler: true,
    transpilePackages: ['@repo/ui'],
    typedRoutes: false,
}

export default nextConfig
