# Prototype implementation

The implementation uses the user-supplied `humanismo-evolutivo-prototipo.zip` as a visual reference. The archive's HTML is ported into typed React markup; no prototype scripts or document instructions are executed at runtime.

- `src/components/design`: editorial homepage, author and vision layouts, introduction sections, and an accessible video dialog.
- `src/app/design.css`: shared forest-green, gold, cream and sage styling, responsive layouts, navigation, listings, authentication and portal layouts.
- `src/app/editorial.css`: the editorial layouts' visual styles from the supplied reference.
- `public/design`: supplied image assets.
- `public/fonts`: self-hosted Cinzel, Cormorant Garamond and Source Sans 3, with their Open Font Licenses.

Book and media listings use the existing application records and preserve database-managed image overrides. Search, download registration, the contact/newsletter integrations, and server-side authentication remain connected to the application's existing services.

The educational portal uses the existing server-side verified-session boundary. Its navigation, library links and calendar work with actual available content. Courses retain an empty state until published; prototype sample enrollment/progress records are not represented as real user data. No database migrations or authentication-policy changes are included.

Validation covers the production build, existing 24 tests, TypeScript, lint on the changed components, and browser checks across desktop (1440px), tablet (768px) and mobile (390px), including search, mobile navigation, download selection, media tabs and the unauthenticated portal redirect. Course enrollment and account creation were not exercised with real user accounts.

Release through feature/prototype-design → dev → qa. Production remains on main.
