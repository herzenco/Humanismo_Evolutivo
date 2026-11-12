import type { NextConfig } from "next";

function configuredSupabaseOrigin() {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
      : null;
  } catch {
    return null;
  }
}

const supabaseOrigin = configuredSupabaseOrigin();
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob: https://*.public.blob.vercel-storage.com",
  `connect-src 'self' https://*.supabase.co${supabaseOrigin ? ` ${supabaseOrigin}` : ''} https://challenges.cloudflare.com https://vitals.vercel-insights.com`,
  "frame-src https://challenges.cloudflare.com https://api.leadconnectorhq.com https://www.youtube.com https://www.youtube-nocookie.com https://open.spotify.com",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
];

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
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
    const education = ['/portal/:path*', '/auth/:path*', '/es/portal/:path*', '/en/portal/:path*', '/es/auth/:path*', '/en/auth/:path*'].map(source => ({
      source,
      destination: `https://educacion.humanismoevolutivo.com/${source.includes('portal') ? 'portal' : 'auth'}/:path*`,
      permanent: false,
    }));
    return [{ source: '/preguntas', destination: '/51preguntas', permanent: true }, { source: '/es/preguntas', destination: '/51preguntas', permanent: true }, { source: '/en/preguntas', destination: '/en/51preguntas', permanent: true }, ...education, ...admin, ...spanish];
  },
  async rewrites() {
    const pages = ['autor', 'libros', 'medios', 'eventos', 'contacto', 'vision', 'privacidad', 'terminos', 'accesibilidad', 'buscar', 'chatbot', 'admin', 'video', '51preguntas'];
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
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
