import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, RefreshCw } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import { ResourceAnalytics } from "@/components/resources/ResourceAnalytics";
import {
  formatResourceDate,
  getResourceArticle,
  resourceArticles,
} from "@/data/resources";

type ResourcePageParams = {
  slug: string;
};

export function generateStaticParams() {
  return resourceArticles.map((article) => ({ slug: article.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<ResourcePageParams>;
}): Promise<Metadata> {
  const article = getResourceArticle((await params).slug);
  if (!article) {
    return {
      title: "Recurso no encontrado",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: { absolute: article.seoTitle },
    description: article.seoDescription,
    alternates: { canonical: `https://humanismoevolutivo.com/resources/${article.slug}/` },
    openGraph: {
      type: "article",
      url: `https://humanismoevolutivo.com/resources/${article.slug}/`,
      title: article.seoTitle,
      description: article.seoDescription,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      ...(article.heroImageUrl
        ? { images: [{ url: article.heroImageUrl, alt: article.heroImageAlt || article.title }] }
        : {}),
    },
    twitter: {
      card: article.heroImageUrl ? "summary_large_image" : "summary",
      title: article.seoTitle,
      description: article.seoDescription,
      ...(article.heroImageUrl ? { images: [article.heroImageUrl] } : {}),
    },
  };
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<ResourcePageParams>;
}) {
  const article = getResourceArticle((await params).slug);
  if (!article) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: `https://humanismoevolutivo.com/resources/${article.slug}/`,
    url: `https://humanismoevolutivo.com/resources/${article.slug}/`,
    author: {
      "@type": article.author === "Humanismo Evolutivo" ? "Organization" : "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Fundación Humanismo Evolutivo",
      url: 'https://humanismoevolutivo.com',
    },
    ...(article.heroImageUrl ? { image: article.heroImageUrl } : {}),
  };
  const safeStructuredData = JSON.stringify(structuredData).replaceAll("<", "\\u003c");

  return (
    <PageWrapper>
      <ResourceAnalytics pageType="resource_article" contentSlug={article.slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeStructuredData }}
      />

      <article>
        <header className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-light py-20 text-white md:py-28">
          <div className="absolute inset-0">
            <div className="absolute left-[8%] top-[10%] h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute bottom-[8%] right-[8%] h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="container relative z-10 mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-gold">
                {article.category}
              </p>
              <h1 className="mt-6 text-balance font-heading text-5xl font-light leading-[1.05] md:text-7xl">
                {article.title}
              </h1>
              <p className="mt-7 max-w-3xl text-xl font-light leading-relaxed text-white/80 md:text-2xl">
                {article.excerpt}
              </p>
              <div className="mt-10 flex flex-col gap-3 text-sm text-white/70 sm:flex-row sm:items-center sm:gap-8">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gold" />
                  Publicado el{" "}
                  <time dateTime={article.publishedAt}>
                    {formatResourceDate(article.publishedAt)}
                  </time>
                </span>
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-gold" />
                  Actualizado el{" "}
                  <time dateTime={article.updatedAt}>{formatResourceDate(article.updatedAt)}</time>
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              {article.heroImageUrl ? (
                <figure className="relative mb-14 aspect-[16/9] overflow-hidden rounded-3xl bg-cream-light shadow-2xl">
                  <Image
                    src={article.heroImageUrl}
                    alt={article.heroImageAlt || article.title}
                    fill
                    priority
                    unoptimized
                    sizes="(max-width: 896px) 100vw, 896px"
                    className="object-cover"
                  />
                </figure>
              ) : null}

              <div
                className="resource-prose"
                dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
              />

              <footer className="mt-16 border-t border-gold/20 pt-8">
                <Link
                  href="/resources/"
                  className="inline-flex items-center gap-2 font-medium text-gold-dark transition-colors hover:text-navy-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Volver a Recursos
                </Link>
              </footer>
            </div>
          </div>
        </div>
      </article>
    </PageWrapper>
  );
}
