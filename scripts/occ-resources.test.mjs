import assert from "node:assert/strict";
import test from "node:test";
import {
  fetchPublishedCollection,
  normalizePublishedCollection,
  sanitizeMarkdown,
} from "./lib/occ-resources.mjs";

const property = "humanismo-evolutivo";
const siteUrl = "https://yosoynosotros.org";

function article(overrides = {}) {
  return {
    id: "22222222-2222-4222-8222-222222222222",
    property,
    status: "published",
    slug: "conciencia-colectiva",
    title: "Conciencia colectiva",
    excerpt: "Una introducción práctica.",
    body: "## Una visión compartida\n\nEl contenido del artículo.",
    published_at: "2026-08-14T18:00:00.000Z",
    updated_at: "2026-08-15T18:00:00.000Z",
    ...overrides,
  };
}

test("normalizes, defaults, and sorts the complete published collection", () => {
  const result = normalizePublishedCollection(
    {
      data: [
        article(),
        article({
          id: "33333333-3333-4333-8333-333333333333",
          slug: "evolucion-consciente",
          title: "Evolución consciente",
          published_at: "2026-08-16T18:00:00.000Z",
          updated_at: "2026-08-16T18:00:00.000Z",
          seo: { title: "Evolución consciente | Humanismo Evolutivo" },
        }),
      ],
    },
    { property, siteUrl },
  );

  assert.deepEqual(
    result.map((item) => item.slug),
    ["evolucion-consciente", "conciencia-colectiva"],
  );
  assert.equal(result[0].seoDescription, "Una introducción práctica.");
  assert.equal(result[0].category, "Recursos");
  assert.equal(result[0].author, "Humanismo Evolutivo");
  assert.equal(
    result[0].canonicalUrl,
    "https://yosoynosotros.org/resources/evolucion-consciente/",
  );
  assert.match(result[0].bodyHtml, /<h2>Una visión compartida<\/h2>/);
});

test("accepts an empty authoritative collection", () => {
  assert.deepEqual(normalizePublishedCollection({ data: [] }, { property, siteUrl }), []);
});

test("sanitizes executable and unsupported Markdown HTML", () => {
  const html = sanitizeMarkdown(`
# A second H1

<script>alert('x')</script>

<p onclick="alert(1)">Safe text</p>

[Bad](javascript:alert(1)) [Protocol relative](//evil.example/read) [External](https://example.com/read)

![Image](https://cdn.example.com/image.jpg)

<iframe src="https://example.com"></iframe>
  `);

  assert.doesNotMatch(html, /<h1|<script|onclick|javascript:|<iframe/i);
  assert.doesNotMatch(html, /href="\/\//i);
  assert.match(html, /<a href="https:\/\/example\.com\/read" rel="noopener noreferrer">External<\/a>/);
  assert.match(html, /<img src="https:\/\/cdn\.example\.com\/image\.jpg" alt="Image" loading="lazy" \/>/);
});

test("rejects records outside the requested property or published status", () => {
  assert.throws(
    () =>
      normalizePublishedCollection(
        { data: [article({ property: "another-project" })] },
        { property, siteUrl },
      ),
    /outside the requested published property set/,
  );
  assert.throws(
    () =>
      normalizePublishedCollection(
        { data: [article({ status: "draft" })] },
        { property, siteUrl },
      ),
    /outside the requested published property set/,
  );
});

test("rejects invalid, duplicate, and unsafe records", () => {
  assert.throws(
    () => normalizePublishedCollection({ data: [article({ slug: "Not Safe" })] }, { property, siteUrl }),
    /Invalid content slug/,
  );
  assert.throws(
    () => normalizePublishedCollection({ data: [article(), article()] }, { property, siteUrl }),
    /duplicate id or slug/,
  );
  assert.throws(
    () =>
      normalizePublishedCollection(
        { data: [article({ body: "<script>alert(1)</script>" })] },
        { property, siteUrl },
      ),
    /no renderable body/,
  );
  assert.throws(
    () =>
      normalizePublishedCollection(
        { data: [article({ canonical_url: "javascript:alert(1)" })] },
        { property, siteUrl },
      ),
    /invalid canonical_url/,
  );
});

test("fetches the complete collection with private authentication and filters", async () => {
  let requestedUrl;
  let requestedOptions;
  const result = await fetchPublishedCollection({
    apiUrl: "https://operations.example.com/api/v1/content?existing=value",
    token: "private-token",
    property,
    siteUrl,
    fetchImpl: async (url, options) => {
      requestedUrl = url;
      requestedOptions = options;
      return Response.json({ data: [article()] });
    },
  });

  assert.equal(requestedUrl.searchParams.get("property"), property);
  assert.equal(requestedUrl.searchParams.get("status"), "published");
  assert.equal(requestedUrl.searchParams.get("existing"), "value");
  assert.equal(requestedOptions.headers.authorization, "Bearer private-token");
  assert.equal(result.length, 1);
});

test("fails synchronization when the OCC request fails", async () => {
  await assert.rejects(
    fetchPublishedCollection({
      apiUrl: "https://operations.example.com/api/v1/content",
      token: "private-token",
      property,
      siteUrl,
      fetchImpl: async () => new Response(null, { status: 503, statusText: "Unavailable" }),
    }),
    /OCC content request failed \(503 Unavailable\)/,
  );
});
