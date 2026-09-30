# refactor_design — propuesta de rediseño (Humanismo Evolutivo)

Design-only handoff for the full redesign of the public site and the education portal.
**Nothing here is implemented yet**: this folder is the reference to build from.

- **42 screen groups and 158 design files** across Laptop **1440 px**, iPad **834 px** and iPhone **390 px**. The total is greater than 42 × 3 because it includes continuation canvases, component sheets and UI states. The two additional files complete the tablet and mobile versions of the Recursos empty state.
- Presentation for the client: [`Humanismo-Evolutivo-Propuesta-Rediseno.pdf`](Humanismo-Evolutivo-Propuesta-Rediseno.pdf) (cover, clickable index, visual system, one page per screen with the three breakpoints side by side, pending items).
- Browse every screen: open [`index.html`](index.html) in a browser (it links to each screen at each breakpoint; screens link to each other like the real site).
- Tokens: [`design-tokens.json`](design-tokens.json) · Screen map: [`screens.json`](screens.json).
- Live editable prototype (private claude.ai Design canvas, owner only): https://claude.ai/artifact/3zHcTAkgLhc1xd4HfoyYt1

## Folder layout

| path | what |
|---|---|
| `index.html` | table of every screen → breakpoint → file, with the route it maps to |
| `html/*.html` | standalone static HTML of every design (shared header/footer inlined; images → `../assets/`). Open directly in a browser. |
| `source/*.dc.html`, `source/canvas.json` | the original canvas sources (Design Component format: inline styles, `<dc-import>` for shared parts). Reference only. |
| `assets/*.jpg` | every image used, with readable names |
| `screens.json` | machine-readable screen list: section, title, route, `unpublished`, and per breakpoint the files, sizes, states and continuation parts |
| `design-tokens.json` | colors, fonts, type scale per breakpoint, spacing, radii, component specs, imagery rules |
| `SEO-AEO-PAGE-INVENTORY.md` | deduplicated real-route inventory with proposed Spanish metadata, canonical/indexing guidance and structured-data opportunities |
| `scripts/validate_design.py` | dependency-free, read-only integrity validator for the manifest, canvases, links, accessibility basics, tokens, typography and protected imagery |

Run the design-source validator from the repository root:

```bash
python3 refactor_design/scripts/validate_design.py
```

The validator returns a non-zero exit code for blocking integrity errors. Known placeholder destinations such as unconfirmed social links are grouped as warnings; pass `--show-pending` to list every file and line.

File naming: `Name.html` = laptop, `Name-tablet.html` = iPad, `Name-movil.html` = iPhone. Long pages were split only because
the design canvas caps a frame at 8000 px: `Name-movil-2.html` is simply the continuation of `Name-movil.html` (the
"Continuar / Seguir leyendo" pill between parts is a canvas artifact — in code these are one scrolling page).
`Main.html` is the laptop version of "Descubre todo su contenido" (iPad/iPhone: `Descubre-tablet*`, `Descubre-movil*`).

## Design system (summary — full values in `design-tokens.json`)

- **Palette:** forest `#173F2C` (header, hero, footer, emphasis bands), green `#2F6B45` (primary actions/links), sage `#EAF0E1` and ivory `#FAF7EF` grounds (alternate by section), white cards, ink `#1D2B22` / body `#3E4D43`, gold `#D4AF5A` **only on dark** (gold text on light: `#7A5C18`). Replaces the current navy/gold/cream Tailwind tokens.
- **Type:** Cormorant Garamond (headings, quotes) · Cinzel (uppercase eyebrows, Roman numerals, the "CONOCER • COMPRENDER • TRANSFORMAR • EVOLUCIONAR" band) · Source Sans 3 (body/UI; replaces Inter). Always `font-variant-numeric: lining-nums`; never Arabic digits in Cinzel.
- **Layout:** content width 1200 / 754 / 350 with 120 / 40 / 20 px gutters. Laptop grids of 3–4 become 2 on iPad and 1 on iPhone.
- **Shared components:** header (laptop: logo + Autor · Libros · Medios · Eventos · Visión · Contacto + search + ES + "Portal educativo"; iPad/iPhone: logo + search + menu), full-screen menu (iPad/iPhone), footer (newsletter, Explora / Obras / Participa columns, contact, Parque·Cancún logo + QR, legal row, CONOCER band). The portal has its own light header with Cursos | Calendario pills.
- **Patterns:** pill buttons (52–56 px), chips on sage, numbered-circle section headers only for numbered sequences (else Cinzel eyebrow + Cormorant H2), arch-framed portraits, book covers never cropped, drawn video/podcast frames instead of embeds in the mockups (use real YouTube/Spotify embeds in code).
- **Imagery rule:** the two illustrations `de-donde-venimos.jpg` and `hacia-donde-podemos-evolucionar.jpg` have text baked in — never crop, overlay or recolor them.

## Screens and routes

See `screens.json` / `index.html` for the full list. Highlights:

- **New page:** `/descubre` — "Descubre todo su contenido", the client-approved hub (brochure's 8 contents). The home (`/`) links to it.
- **Per-item pages designed individually:** all 5 books (`/libros/[bookId]`), all 4 podcast series (`/medios/show/[showId]`), both events (`/eventos/[eventId]`); one episode template (`/medios/[showId]/[episodeSlug]`).
- **States:** home welcome-video modal, download dialog + confirmation, search results / empty / no results, Recursos empty state, auth alerts.
- **Unpublished (exist only on `feat/education-portal-qa`):** `/resources` + `/resources/[slug]` (Recursos) and the whole portal (`/auth` flow, `/portal`, course, class reader, 2027 calendar agenda/month). Admin (`/admin`) is designed at all three sizes.

## Content decisions made in the design

- Spanish sentence case for UI labels; spelling **"conciencia"** everywhere.
- Book titles: *Yo soy nosotros*, *Ecología y espiritualidad*, *¡Déjalo ser!*, *¡Y lo mejor aún está por venir!* (podcast series: "Y lo mejor está por venir"), *El arte de ser empresario*, *Humanismo evolutivo* (book VI, no cover yet).
- Episode titles normalized to sentence case with obvious typos fixed ("Transpersona" → "Transpersonal", "Prologo" → "Prólogo", "Energia" → "Energía", "Adn" → "ADN").
- The "Y lo mejor está por venir" series description had lost its first paragraph in `src/data/showLongform.ts` (dropped in commit f0853e6); the design restores it from commit 9a634e5.
- Raw translation keys and English error strings on the live site were replaced with the intended Spanish copy.
- Provisional telephone and email values were removed from actionable links. The designs show `[Teléfono por confirmar]` and `[Correo por confirmar]` until the owner resolves the conflicting source data; unresolved social, language, video, audio and community destinations are visibly disabled.
- Placeholders in `[brackets]` mark content that still has to be supplied (e.g. `[Dirección por confirmar]`, `[PORTADA PENDIENTE]`, portal user data, lesson text — the private curriculum is never reproduced).

## Pending before/while implementing

**Images needed:** high-res originals of the three gardens, the sculpture and the three philosophers (current files are low-res crops from the brochure); Parque·Cancún logo (vector) and the original QR; cover for book VI; a portrait-format author photo; stills for the Parque Cancún documentary, the welcome video and the SMGE video; podcast series artwork; photos for Recursos articles and the current edition of *El arte de ser empresario*.

**Data to confirm:** physical address and phone (998.8888888 looks provisional); one contact email (gmail vs hello@humanismoevolutivo.com in the legal pages); real social URLs (the live footer points to bare facebook.com etc.); SMGE video date/duration/ID (data disagrees: 42:53 · 2025-01-01 · HLHjY3NnX2k vs 1:15:30 · 2024-10-28 · LRr-CKjfmrE; the event was 2025-10-28); exact title of book IV; the *¡Déjalo ser!* description (site: near-future data/identity novel; brochure: Maya family over three generations); whether downloads are full books or summaries (files are `*_Resumen.pdf`), and book year/page counts; podcast episode dates (exact weekly sequence — looks like filler) and slugs that don't match titles; real Recursos articles (the design uses the 3 demo articles from `resources.demo.ts`); venue of the 2027 in-person classes. The source designs now expose these gaps with neutral `[Por confirmar]` copy or disabled controls instead of presenting provisional data as final.

**Code issues noticed while inventorying (not fixed here):** dates parsed as UTC show a day early in Mexico (`new Date('YYYY-MM-DD')`); `/libros` has no PDF mapped for *Y lo mejor…* so that download fails; the book download handler pushes name + email into the GTM dataLayer; the 404 page is English with no header/footer; `/contacto` is not linked from the nav; three different site domains appear in metadata/sitemap/legal pages.
