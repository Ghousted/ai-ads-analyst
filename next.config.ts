import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Reports and the agency logo carry images inline, so saving them needs more than the 1 MB default.
  experimental: { serverActions: { bodySizeLimit: '12mb' } },
};

export default nextConfig;
