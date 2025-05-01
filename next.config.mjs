/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        port: '',
        pathname: '/**',
      },
      // Add other allowed hostnames here if needed
    ],
  },
  // Add other Next.js configurations here
};

export default nextConfig;
