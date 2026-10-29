import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  async redirects() {
    // The standalone admin app owns its navigation and authentication.
    // Old admin subpaths enter through its landing page, avoiding stale routes.
    const admin = ['/admin/:path*', '/es/admin/:path*', '/en/admin/:path*'].map(source => ({
      source,
      destination: 'https://admin.humanismoevolutivo.com',
      permanent: true,
    }));
    // Spanish pages are served without the /es prefix. /en stays explicit.
    const spanish = [
      { source: '/es', destination: '/', permanent: true },
      { source: '/es/:path*', destination: '/:path*', permanent: true },
    ];
    return [...admin, ...spanish];
  },
  async rewrites() {
    const pages = ['autor', 'libros', 'medios', 'eventos', 'contacto', 'vision', 'privacidad', 'terminos', 'buscar', 'chatbot', 'auth', 'admin', 'video', '51preguntas'];
    return {
      beforeFiles: [
        { source: '/', destination: '/es' },
        ...pages.flatMap(page => [
          { source: `/${page}`, destination: `/es/${page}` },
          { source: `/${page}/:path*`, destination: `/es/${page}/:path*` },
        ]),
      ],
    };
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
