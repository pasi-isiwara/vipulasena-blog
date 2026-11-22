import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Every page here is rendered per request: the language comes from a cookie
     and the content from the database, so there is nothing to prerender.
     Cache Components is off for that reason. */
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
};

export default nextConfig;
