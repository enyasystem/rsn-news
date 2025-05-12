/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'punchng.com',
      'www.punchng.com',
      'guardian.ng',
      'www.guardian.ng',
      'vanguardngr.com',
      'www.vanguardngr.com',
      'channelstv.com',
      'www.channelstv.com',
      'premiumtimesng.com',
      'www.premiumtimesng.com',
      'source.unsplash.com',
      'images.unsplash.com',
    ],
  },
}

export default nextConfig
