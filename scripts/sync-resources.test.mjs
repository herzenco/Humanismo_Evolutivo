import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { syncResources } from "./sync-resources.mjs";

const validSnapshot = {
  property: "humanismo-evolutivo",
  data: [
    {
      id: "22222222-2222-4222-8222-222222222222",
      property: "humanismo-evolutivo",
      slug: "conciencia-colectiva",
      title: "Conciencia colectiva",
      excerpt: "Una introducción práctica.",
      bodyHtml: "<p>El contenido del artículo.</p>",
      publishedAt: "2026-08-14T18:00:00.000Z",
      updatedAt: "2026-08-15T18:00:00.000Z",
      seoTitle: "Conciencia colectiva",
      seoDescription: "Una introducción práctica.",
      heroImageUrl: null,
      heroImageAlt: null,
      canonicalUrl: "https://yosoynosotros.org/resources/conciencia-colectiva/",
      author: "Humanismo Evolutivo",
      category: "Recursos",
    },
  ],
};

async function temporarySnapshot(contents = JSON.stringify(validSnapshot)) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "occ-resources-test-"));
  const snapshotPath = path.join(directory, "occ-resources.json");
  await fs.writeFile(snapshotPath, contents, "utf8");
  return { directory, snapshotPath };
}

test("uses an existing valid snapshot only when the opt-in is exactly true and config is incomplete", async (t) => {
  const { directory, snapshotPath } = await temporarySnapshot();
  t.after(() => fs.rm(directory, { recursive: true, force: true }));
  let fetched = false;

  const articles = await syncResources({
    env: { OCC_RESOURCES_ALLOW_SNAPSHOT: "true" },
    snapshotPath,
    fetchImpl: async () => {
      fetched = true;
      throw new Error("fetch should not run");
    },
  });

  assert.equal(fetched, false);
  assert.deepEqual(articles, validSnapshot.data);
  assert.equal(await fs.readFile(snapshotPath, "utf8"), JSON.stringify(validSnapshot));
});

test("keeps missing OCC configuration strict by default", async () => {
  await assert.rejects(
    syncResources({ env: {} }),
    /OCC_CONTENT_API_URL, OCC_CONTENT_API_TOKEN, OCC_CONTENT_PROPERTY, and SITE_URL are required/,
  );
});

test("does not enable fallback for values other than the exact string true", async () => {
  await assert.rejects(
    syncResources({ env: { OCC_RESOURCES_ALLOW_SNAPSHOT: "TRUE" } }),
    /OCC_CONTENT_API_URL, OCC_CONTENT_API_TOKEN, OCC_CONTENT_PROPERTY, and SITE_URL are required/,
  );
});

test("rejects a missing or malformed fallback snapshot", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "occ-resources-test-"));
  t.after(() => fs.rm(directory, { recursive: true, force: true }));

  await assert.rejects(
    syncResources({
      env: { OCC_RESOURCES_ALLOW_SNAPSHOT: "true" },
      snapshotPath: path.join(directory, "missing.json"),
    }),
    /snapshot fallback could not read/,
  );

  const malformedPath = path.join(directory, "malformed.json");
  await fs.writeFile(malformedPath, JSON.stringify({ property: "humanismo-evolutivo", data: [{}] }));
  await assert.rejects(
    syncResources({
      env: { OCC_RESOURCES_ALLOW_SNAPSHOT: "true" },
      snapshotPath: malformedPath,
    }),
    /snapshot article at index 0 has invalid field id/,
  );
});

test("does not swallow remote failures when OCC configuration is complete", async (t) => {
  const { directory, snapshotPath } = await temporarySnapshot();
  t.after(() => fs.rm(directory, { recursive: true, force: true }));

  await assert.rejects(
    syncResources({
      env: {
        OCC_RESOURCES_ALLOW_SNAPSHOT: "true",
        OCC_CONTENT_API_URL: "https://operations.example.com/api/v1/content",
        OCC_CONTENT_API_TOKEN: "private-token",
        OCC_CONTENT_PROPERTY: "humanismo-evolutivo",
        SITE_URL: "https://yosoynosotros.org",
      },
      snapshotPath,
      fetchImpl: async () => new Response(null, { status: 503, statusText: "Unavailable" }),
    }),
    /OCC content request failed \(503 Unavailable\)/,
  );

  assert.equal(await fs.readFile(snapshotPath, "utf8"), JSON.stringify(validSnapshot));
});
