import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;

const SANITIZER_OPTIONS = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "s",
    "blockquote",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "code",
    "pre",
    "hr",
    "img",
    "figure",
    "figcaption",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["scope", "colspan", "rowspan"],
    td: ["colspan", "rowspan"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {
    a: ["http", "https", "mailto"],
    img: ["http", "https"],
  },
  allowProtocolRelative: false,
  transformTags: {
    a: (_tagName, attributes) => ({
      tagName: "a",
      attribs: {
        ...attributes,
        ...(/^https?:\/\//i.test(attributes.href ?? "")
          ? { rel: "noopener noreferrer" }
          : {}),
      },
    }),
    img: (_tagName, attributes) => ({
      tagName: "img",
      attribs: { ...attributes, loading: "lazy" },
    }),
  },
};

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requiredString(value, field, slug = "(unknown)") {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Published item "${slug}" is missing required field ${field}`);
  }
  return value.trim();
}

function optionalString(value, fallback, field, slug) {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value !== "string") {
    throw new Error(`Published item "${slug}" has invalid field ${field}`);
  }
  return value.trim() || fallback;
}

function normalizeTimestamp(value, field, slug) {
  if (typeof value !== "string" || !ISO_TIMESTAMP.test(value)) {
    throw new Error(`Published item "${slug}" has invalid ${field}`);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Published item "${slug}" has invalid ${field}`);
  }

  return date.toISOString();
}

function absoluteHttpUrl(value, field, slug) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Published item "${slug}" has invalid ${field}`);
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Published item "${slug}" has invalid ${field}`);
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`Published item "${slug}" has invalid ${field}`);
  }

  return url.toString();
}

export function sanitizeMarkdown(value) {
  const rendered = marked.parse(String(value), { async: false, gfm: true });
  return sanitizeHtml(rendered, SANITIZER_OPTIONS).trim();
}

export function normalizePublishedCollection(
  payload,
  { property, siteUrl, defaultAuthor = "Humanismo Evolutivo", defaultCategory = "Recursos" },
) {
  if (!property || typeof property !== "string") {
    throw new Error("OCC_CONTENT_PROPERTY is required");
  }
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    throw new Error("OCC content response must contain a data array");
  }

  const normalizedSiteUrl = absoluteHttpUrl(siteUrl, "SITE_URL", "configuration").replace(/\/$/, "");
  const seenIds = new Set();
  const seenSlugs = new Set();

  return payload.data
    .map((item) => {
      if (!isRecord(item)) throw new Error("OCC content response contains a non-object item");

      const slug = typeof item.slug === "string" ? item.slug : "";
      if (item.property !== property || item.status !== "published") {
        throw new Error("OCC returned content outside the requested published property set");
      }
      if (!UUID.test(typeof item.id === "string" ? item.id : "")) {
        throw new Error(`Published item "${slug || "(unknown)"}" has an invalid id`);
      }
      if (!SLUG.test(slug)) {
        throw new Error(`Invalid content slug: ${slug || "(missing)"}`);
      }
      if (seenIds.has(item.id) || seenSlugs.has(slug)) {
        throw new Error(`OCC content response contains duplicate id or slug: ${slug}`);
      }
      seenIds.add(item.id);
      seenSlugs.add(slug);

      const title = requiredString(item.title, "title", slug);
      const excerpt = requiredString(item.excerpt, "excerpt", slug);
      const body = requiredString(item.body, "body", slug);
      const publishedAt = normalizeTimestamp(item.published_at, "published_at", slug);
      const updatedAt = normalizeTimestamp(item.updated_at, "updated_at", slug);

      if (item.seo !== undefined && item.seo !== null && !isRecord(item.seo)) {
        throw new Error(`Published item "${slug}" has invalid field seo`);
      }
      const seo = isRecord(item.seo) ? item.seo : {};

      let heroImageUrl = null;
      let heroImageAlt = null;
      if (item.hero_image !== undefined && item.hero_image !== null) {
        if (!isRecord(item.hero_image)) {
          throw new Error(`Published item "${slug}" has invalid field hero_image`);
        }
        heroImageUrl = absoluteHttpUrl(item.hero_image.url, "hero_image.url", slug);
        heroImageAlt = optionalString(item.hero_image.alt, title, "hero_image.alt", slug);
      }

      const canonicalUrl =
        item.canonical_url === undefined || item.canonical_url === null || item.canonical_url === ""
          ? `${normalizedSiteUrl}/resources/${slug}/`
          : absoluteHttpUrl(item.canonical_url, "canonical_url", slug);
      const bodyHtml = sanitizeMarkdown(body);
      if (!bodyHtml) {
        throw new Error(`Published item "${slug}" has no renderable body after sanitization`);
      }

      return {
        id: item.id,
        property,
        slug,
        title,
        excerpt,
        bodyHtml,
        publishedAt,
        updatedAt,
        seoTitle: optionalString(seo.title, title, "seo.title", slug),
        seoDescription: optionalString(seo.description, excerpt, "seo.description", slug),
        heroImageUrl,
        heroImageAlt,
        canonicalUrl,
        author: optionalString(item.author, defaultAuthor, "author", slug),
        category: optionalString(item.category, defaultCategory, "category", slug),
      };
    })
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));
}

export async function fetchPublishedCollection({ apiUrl, token, property, siteUrl, fetchImpl = fetch }) {
  if (!apiUrl || !token || !property || !siteUrl) {
    throw new Error(
      "OCC_CONTENT_API_URL, OCC_CONTENT_API_TOKEN, OCC_CONTENT_PROPERTY, and SITE_URL are required",
    );
  }

  let endpoint;
  try {
    endpoint = new URL(apiUrl);
  } catch {
    throw new Error("OCC_CONTENT_API_URL must be a valid URL");
  }
  if (!['http:', 'https:'].includes(endpoint.protocol)) {
    throw new Error("OCC_CONTENT_API_URL must use http or https");
  }
  endpoint.searchParams.set("property", property);
  endpoint.searchParams.set("status", "published");

  const response = await fetchImpl(endpoint, {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`OCC content request failed (${response.status} ${response.statusText || ""})`.trim());
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error("OCC content response was not valid JSON");
  }

  return normalizePublishedCollection(payload, { property, siteUrl });
}
