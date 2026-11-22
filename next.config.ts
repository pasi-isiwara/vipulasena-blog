import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Every page here is rendered per request: the language comes from a cookie
     and the content from the database, so there is nothing to prerender.
     Cache Components is off for that reason. */
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },

  async redirects() {
    return [
      /* "Academic posts" became "General thoughts" on 2026-11-22. Kept so an
         old link or bookmark still lands on the right page.

         permanent is false on purpose: a 308 is cached hard by browsers and
         would be awkward to undo. Worth turning to true once the name has
         settled and the site is public. */
      {
        source: '/academic-posts',
        destination: '/general-thoughts',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
