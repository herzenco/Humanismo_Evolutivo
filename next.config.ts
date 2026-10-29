import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  async redirects() {
    // The standalone admin app owns its navigation and authentication.
    // Old admin subpaths enter through its landing page, avoiding stale routes.
    return ['/admin/:path*', '/es/admin/:path*', '/en/admin/:path*'].map(source => ({
      source,
      destination: 'https://admin.humanismoevolutivo.com',
      permanent: true,
    }));
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qlqkdininewormskpnya.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // OCC content can reference approved images from different publishing CDNs.
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
