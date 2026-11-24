import type { NextConfig } from "next";
import { EN_ENABLED, PORTAL_ENABLED } from "./src/lib/release-flags";

const securityHeaders = [
  { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/qa-access",
        headers: [{ key: "Referrer-Policy", value: "same-origin" }],
      },
    ];
  },
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
    const educationRoutes = [
      '/portal/:path*', '/auth/:path*', '/es/portal/:path*', '/es/auth/:path*',
      ...(EN_ENABLED ? ['/en/portal/:path*', '/en/auth/:path*'] : []),
    ];
    const education = PORTAL_ENABLED ? educationRoutes.map(source => ({
      source,
      destination: `https://educacion.humanismoevolutivo.com/${source.includes('portal') ? 'portal' : 'auth'}/:path*`,
      permanent: false,
    })) : [];
    return [{ source: '/preguntas', destination: '/51preguntas', permanent: true }, { source: '/es/preguntas', destination: '/51preguntas', permanent: true }, { source: '/en/preguntas', destination: '/en/51preguntas', permanent: true }, ...education, ...admin, ...spanish];
  },
  async rewrites() {
    const pages = ['autor', 'libros', 'clases', 'jardines', 'videos', 'podcasts', 'medios', 'eventos', 'contacto', 'vision', 'privacidad', 'terminos', 'buscar', 'chatbot', 'admin', 'video', '51preguntas'];
    return {
      beforeFiles: [
        { source: '/', destination: '/es' },
        { source: '/boletin', destination: '/es/boletin' },
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
    ],
  },
};

export default nextConfig;
