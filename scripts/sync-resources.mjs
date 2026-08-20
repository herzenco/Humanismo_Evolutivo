import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchPublishedCollection } from "./lib/occ-resources.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(projectRoot, "src", "generated", "occ-resources.json");

export async function syncResources({ env = process.env, fetchImpl = fetch } = {}) {
  const property = env.OCC_CONTENT_PROPERTY;
  const articles = await fetchPublishedCollection({
    apiUrl: env.OCC_CONTENT_API_URL,
    token: env.OCC_CONTENT_API_TOKEN,
    property,
    siteUrl: env.SITE_URL,
    fetchImpl,
  });

  const snapshot = `${JSON.stringify({ property, data: articles }, null, 2)}\n`;
  const temporaryPath = `${outputPath}.${process.pid}.tmp`;
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(temporaryPath, snapshot, { encoding: "utf8", mode: 0o600 });
  await fs.rename(temporaryPath, outputPath);

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
