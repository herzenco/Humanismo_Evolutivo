import snapshot from "@/generated/occ-resources.json";
import { localDemoResourceArticles } from "@/data/resources.demo";

export type ResourceArticle = {
  id: string;
  property: string;
  slug: string;
  title: string;
  excerpt: string;
  bodyHtml: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  canonicalUrl: string;
  author: string;
  category: string;
};

const localDemoEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.OCC_RESOURCES_LOCAL_DEMO === "true";

export const resourceArticles = localDemoEnabled
  ? localDemoResourceArticles
  : (snapshot.data as ResourceArticle[]);

export function getResourceArticle(slug: string) {
  return resourceArticles.find((article) => article.slug === slug) ?? null;
}

export function formatResourceDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
