import createNextIntlPlugin from 'next-intl/plugin';

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
      {
        protocol: 'https',
        hostname: 'intern.osfs.world',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'khidnpzqnfvmhexierlo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/**',
      },
      // Add other allowed hostnames here if needed
    ],
  },
  // Add other Next.js configurations here
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
