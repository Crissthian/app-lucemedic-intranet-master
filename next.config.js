/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  env: {
    API_BASE_PATH: process.env.API_PATH_LUCEMEDIC,
  },
  transpilePackages: ['@mui/x-charts'],
  trailingSlash: true
}

module.exports = nextConfig
