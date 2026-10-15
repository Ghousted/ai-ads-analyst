import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Reports and the agency logo carry images inline, so saving them needs more than the 1 MB default.
  experimental: { serverActions: { bodySizeLimit: '12mb' } },
  // Headless Chrome for report PDFs ships its own binary, so it isn't bundled.
  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],
};

export default nextConfig;
