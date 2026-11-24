import { pageMetadata } from "@/lib/seo";
import { ArrowUpRight, LibraryBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import styles from "./magazine.module.css";
import PageWrapper from "@/components/layout/PageWrapper";
import { ResourceAnalytics } from "@/components/resources/ResourceAnalytics";
import { ResourceCardLink } from "@/components/resources/ResourceCardLink";
import { formatResourceDate, resourceArticles } from "@/data/resources";

const description = "Artículos y reflexiones sobre filosofía, conciencia, ciencia y espiritualidad en la revista de Humanismo Evolutivo.";

export const metadata = pageMetadata({
  title: "Revista de Humanismo Evolutivo",
  description,
  path: "/resources",
  language: "es",
  localized: false,
});

export default function ResourcesPage() {
  return (
    <PageWrapper>
      <ResourceAnalytics pageType="resources_index" />

      <section className="relative overflow-hidden bg-gradient-to-br from-navy-dark via-navy to-navy-light py-28 text-white md:py-36">
        <div className="absolute inset-0">
          <div className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute bottom-[12%] right-[10%] h-56 w-56 rounded-full bg-white/5 blur-3xl" />
          <LibraryBig className="absolute right-[18%] top-[20%] h-24 w-24 text-gold/10" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.3em] text-gold">
              Ideas para una conciencia en evolución
            </p>
            <h1 className="font-heading text-6xl font-light leading-none md:text-8xl">
              Revista de Humanismo Evolutivo
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-xl font-light leading-relaxed text-white/80 md:text-2xl">
              Artículos y reflexiones para profundizar en la relación entre conciencia,
              humanidad, ciencia y espíritu.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-white via-cream-light/30 to-white py-24 md:py-32">
        <div className="container mx-auto px-6">
          {resourceArticles.length ? (
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
              {resourceArticles.map((article, index) => (
                <article key={article.id}>
                  <ResourceCardLink slug={article.slug}>
                    <span
                      aria-hidden="true"
                      className="absolute right-6 top-3 font-heading text-8xl font-light text-navy/5 transition-colors group-hover:text-gold/10"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="relative flex h-full flex-col">
                      <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.18em] text-gold-dark">
                        <span>{article.category}</span>
                        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold/60" />
                        <time dateTime={article.publishedAt}>
                          {formatResourceDate(article.publishedAt)}
                        </time>
                      </div>
                      <h2 className="max-w-xl font-heading text-4xl font-light leading-tight text-navy-dark transition-colors group-hover:text-gold-dark md:text-5xl">
                        {article.title}
                      </h2>
                      <p className="mt-5 flex-grow text-lg leading-relaxed text-navy-light">
                        {article.excerpt}
                      </p>
                      <span className="mt-10 inline-flex items-center gap-2 font-medium text-gold-dark">
                        Leer artículo
                        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </ResourceCardLink>
                </article>
              ))}
            </div>
          ) : (
            <section className={styles.preview} aria-labelledby="magazine-preview-title">
              <div className={styles.copy}>
                <p className={styles.status}>Próximamente</p>
                <h2 id="magazine-preview-title">Las ideas también <em>evolucionan.</em></h2>
                <p>Estamos preparando la primera edición de la revista, con artículos y reflexiones sobre filosofía, ciencia y espiritualidad.</p>
                <Link href="/51preguntas" className="design-button design-button-outline">
                  Explorar las 51 preguntas<ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
              <div className={styles.art} aria-hidden="true">
                <div className={styles.cover}>
                  <Image
                    src="/design/jardines/parque-88.webp"
                    alt=""
                    fill
                    sizes="(max-width: 767px) 68vw, 320px"
                    className={styles.coverImage}
                  />
                  <span>Humanismo<br />Evolutivo</span>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
