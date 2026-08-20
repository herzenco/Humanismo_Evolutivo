# OCC-managed Recursos publishing

The Operations Command Center (OCC) is the source of truth for the Recursos section. The public listing and article pages are statically generated from one authoritative build snapshot. Browsers do not call the OCC content API.

## Runtime flow

1. An editor publishes, updates, unpublishes, or archives content in OCC.
2. OCC sends a small authenticated event to `POST https://{website-domain}/api/publish`.
3. The route validates the shared secret and event contract and deduplicates the event within the active warm function instance.
4. The route calls the environment-specific private Vercel Deploy Hook.
5. `npm run build` fetches the complete `status=published` collection, validates and sanitizes it, runs the contract tests, and invokes `next build`.
6. Next.js generates `/resources/`, one `/resources/{slug}/` route per article, metadata, JSON-LD, and sitemap entries from the same snapshot.
7. Vercel activates the immutable deployment. If synchronization or validation fails, the build fails and the preceding production deployment remains active.

The webhook is only an invalidation signal. Its payload must never contain article content.

## Environment variables

Configure these server-only values separately for Vercel Preview and Production:

```dotenv
SITE_URL=https://yosoynosotros.org
OCC_CONTENT_PROPERTY=humanismo-evolutivo
OCC_CONTENT_API_URL=https://operations.example.com/api/v1/content
OCC_CONTENT_API_TOKEN=
OCC_PUBLISH_WEBHOOK_SECRET=
VERCEL_DEPLOY_HOOK_URL=
```

`OCC_CONTENT_PROPERTY` must exactly match the project identifier OCC sends in both webhook events and content records. Change the example value if OCC uses a different identifier. Do not prefix any private value with `NEXT_PUBLIC_`.

Preview must use preview-only OCC credentials and a preview Deploy Hook. Production must use separate production credentials and its production Deploy Hook.

## Webhook contract

```http
POST /api/publish
Authorization: Bearer {OCC_PUBLISH_WEBHOOK_SECRET}
Content-Type: application/json
```

```json
{
  "event_id": "11111111-1111-4111-8111-111111111111",
  "event": "content.published",
  "property": "humanismo-evolutivo",
  "content_id": "22222222-2222-4222-8222-222222222222",
  "slug": "conciencia-colectiva",
  "occurred_at": "2026-08-14T18:00:00.000Z"
}
```

Accepted events are `content.published`, `content.updated`, `content.unpublished`, and `content.archived`. IDs must be UUIDs, the property must equal `OCC_CONTENT_PROPERTY`, the slug must be lowercase kebab case, and `occurred_at` must be an ISO-8601 timestamp.

| Status | Meaning |
| --- | --- |
| `202` | Event accepted and deployment triggered |
| `202`, `duplicate: true` | Event already accepted in the current warm function instance |
| `400` | Invalid JSON or event contract |
| `401` | Invalid webhook secret |
| `405` | Method other than `POST` |
| `500` | Server-side publishing configuration is incomplete |
| `502` | Deploy Hook failed; OCC should retry |

OCC should retain durable event IDs, record delivery attempts, and retry timeouts and `5xx` responses with backoff. It should not retry `4xx` responses until the request is corrected. Website deduplication is best-effort; duplicate immutable deployments are safe.

## Build-time content request

```http
GET {OCC_CONTENT_API_URL}?property={OCC_CONTENT_PROPERTY}&status=published
Authorization: Bearer {OCC_CONTENT_API_TOKEN}
Accept: application/json
```

The response must be the complete authoritative published collection in one response:

```json
{
  "data": [
    {
      "id": "22222222-2222-4222-8222-222222222222",
      "property": "humanismo-evolutivo",
      "status": "published",
      "slug": "conciencia-colectiva",
      "title": "Conciencia colectiva",
      "excerpt": "Una introducción práctica.",
      "body": "## Una visión compartida\n\nContenido en Markdown.",
      "published_at": "2026-08-14T18:00:00.000Z",
      "updated_at": "2026-08-15T18:00:00.000Z",
      "seo": {
        "title": "Conciencia colectiva | Humanismo Evolutivo",
        "description": "Una introducción práctica."
      },
      "hero_image": {
        "url": "https://cdn.example.com/conciencia.jpg",
        "alt": "Personas reunidas en conversación"
      },
      "canonical_url": "https://yosoynosotros.org/resources/conciencia-colectiva/",
      "author": "Humanismo Evolutivo",
      "category": "Conciencia"
    }
  ]
}
```

Required fields are `id`, `property`, `status`, `slug`, `title`, `excerpt`, `body`, `published_at`, and `updated_at`. Defaults are:

| Field | Default |
| --- | --- |
| `seo.title` | Article title |
| `seo.description` | Article excerpt |
| `hero_image` | No hero image |
| `canonical_url` | `{SITE_URL}/resources/{slug}/` |
| `author` | `Humanismo Evolutivo` |
| `category` | `Recursos` |

An empty `data` array is valid and renders the empty Recursos state. Pagination is not implemented; OCC must expose an unpaginated publishing endpoint until pagination is deliberately added.

## Validation and security

The synchronization step fails the deployment when the request fails, JSON is malformed, a record has another property or status, IDs/slugs/dates are invalid, required fields are empty, or IDs/slugs are duplicated.

Markdown is rendered and sanitized before Next.js reads the generated snapshot. The allowlist supports paragraphs, headings below H1, lists, emphasis, blockquotes, links, code, images and figures, tables, and horizontal rules. Scripts, event handlers, embeds, unsupported HTML, unsafe URL schemes, and protocol-relative URLs are removed. External links receive `rel="noopener noreferrer"`, and body images receive `loading="lazy"`.

Tokens, webhook secrets, and Deploy Hook URLs are used only by build scripts and the Node.js route handler. They are never serialized into the generated content snapshot or client bundles. Analytics events contain only page type, content slug, scroll percentage, and active-time measurements; author or visitor personal information is not tracked.

## Commands and preview verification

```bash
npm test
npm run lint
npm run build
```

`npm run build` intentionally requires all four content-sync variables (`SITE_URL`, `OCC_CONTENT_PROPERTY`, `OCC_CONTENT_API_URL`, and `OCC_CONTENT_API_TOKEN`). `npm run build:site` skips synchronization and exists only for local UI work against the already generated snapshot; Vercel must use `npm run build`.

For Preview verification:

1. Publish a test article in the preview OCC property.
2. Confirm a preview deployment is triggered and the listing, static article page, metadata, analytics tags, and sitemap entry appear.
3. Update the article and confirm content, metadata, and sitemap `lastmod` change.
4. Unpublish it and confirm the listing, route, and sitemap entry disappear after the next preview deployment.
5. Send the same event ID twice and confirm the second response is safe.
6. Temporarily use a failing preview Deploy Hook and confirm OCC receives `502` and can retry.
