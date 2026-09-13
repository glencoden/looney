import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    agentRules: false,
    reactCompiler: true,
    transpilePackages: ['@repo/ui'],
    typedRoutes: false,
}

export default nextConfig
