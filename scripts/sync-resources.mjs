import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchPublishedCollection } from "./lib/occ-resources.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(projectRoot, "src", "generated", "occ-resources.json");

const requiredConfiguration = [
  "OCC_CONTENT_API_URL",
  "OCC_CONTENT_API_TOKEN",
  "OCC_CONTENT_PROPERTY",
  "SITE_URL",
];

function hasCompleteConfiguration(env) {
  return requiredConfiguration.every(
    (name) => typeof env[name] === "string" && env[name].trim().length > 0,
  );
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNullableString(value) {
  return value === null || typeof value === "string";
}

function validateSnapshot(snapshot) {
  if (!isRecord(snapshot) || typeof snapshot.property !== "string" || !Array.isArray(snapshot.data)) {
    throw new Error("the snapshot must contain a string property and a data array");
  }

  const requiredStrings = [
    "id",
    "property",
    "slug",
    "title",
    "excerpt",
    "bodyHtml",
    "publishedAt",
    "updatedAt",
    "seoTitle",
    "seoDescription",
    "canonicalUrl",
    "author",
    "category",
  ];

  snapshot.data.forEach((article, index) => {
    if (!isRecord(article)) {
      throw new Error(`snapshot article at index ${index} must be an object`);
    }
    for (const field of requiredStrings) {
      if (typeof article[field] !== "string") {
        throw new Error(`snapshot article at index ${index} has invalid field ${field}`);
      }
    }
    if (!isNullableString(article.heroImageUrl) || !isNullableString(article.heroImageAlt)) {
      throw new Error(`snapshot article at index ${index} has invalid hero image fields`);
    }
    if (article.property !== snapshot.property) {
      throw new Error(`snapshot article at index ${index} does not match the snapshot property`);
    }
  });

  return snapshot.data;
}

async function loadCommittedSnapshot(snapshotPath) {
  let source;
  try {
    source = await fs.readFile(snapshotPath, "utf8");
  } catch (error) {
    throw new Error(`snapshot fallback could not read ${snapshotPath}: ${error.message}`);
  }

  let snapshot;
  try {
    snapshot = JSON.parse(source);
  } catch (error) {
    throw new Error(`snapshot fallback found invalid JSON at ${snapshotPath}: ${error.message}`);
  }

  try {
    return validateSnapshot(snapshot);
  } catch (error) {
    throw new Error(`snapshot fallback found an invalid snapshot at ${snapshotPath}: ${error.message}`);
  }
}

export async function syncResources({
  env = process.env,
  fetchImpl = fetch,
  snapshotPath = outputPath,
} = {}) {
  if (!hasCompleteConfiguration(env) && env.OCC_RESOURCES_ALLOW_SNAPSHOT === "true") {
    return loadCommittedSnapshot(snapshotPath);
  }

  const property = env.OCC_CONTENT_PROPERTY;
  const articles = await fetchPublishedCollection({
    apiUrl: env.OCC_CONTENT_API_URL,
    token: env.OCC_CONTENT_API_TOKEN,
    property,
    siteUrl: env.SITE_URL,
    fetchImpl,
  });

  const snapshot = `${JSON.stringify({ property, data: articles }, null, 2)}\n`;
  const temporaryPath = `${snapshotPath}.${process.pid}.tmp`;
  await fs.mkdir(path.dirname(snapshotPath), { recursive: true });
  await fs.writeFile(temporaryPath, snapshot, { encoding: "utf8", mode: 0o600 });
  await fs.rename(temporaryPath, snapshotPath);

  return articles;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  syncResources()
    .then((articles) => {
      console.info(`Synchronized ${articles.length} published OCC resource article(s).`);
    })
    .catch((error) => {
      console.error(`OCC resource synchronization failed: ${error.message}`);
      process.exitCode = 1;
    });
}
