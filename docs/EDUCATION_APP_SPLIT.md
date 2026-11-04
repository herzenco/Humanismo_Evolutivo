# Standalone education portal

Education now lives in `herzenco/educacion-humanismo-evolutivo` (private repository), Vercel project `educacion-humanismo-evolutivo`, at https://educacion.humanismoevolutivo.com.

The app owns portal/course routes, authentication and confirmations, and the courses, learning, teaching, attendance, and education APIs. The main marketing app redirects legacy portal/auth paths and links visitors to the education origin. Main-site deployment remains subject to the existing dev → QA → main promotion process.

The education app uses the existing Supabase project iwtcdjkawcjsxmwhzlot; accounts, roles, course content, progress, and attendance are preserved. No schema was migrated and no data was copied. Its production callback and confirmation URLs are allowlisted alongside the existing admin callbacks.

DNS: GoDaddy CNAME host `educacion`, target `37812f7e65c72a49.vercel-dns-016.com` (Vercel's project-specific recommendation). Retain all other DNS records.
