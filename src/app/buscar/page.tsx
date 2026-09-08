"use client";

import { useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search as SearchIcon, BookOpen, Headphones, Video } from 'lucide-react';
import PageWrapper from "@/components/layout/PageWrapper";
import { useLanguage } from '@/contexts/LanguageContext';
import { books, localizeBook } from '@/data/books';
import { podcasts, videos } from '@/data/media';
import { getPodcastEpisodeContent } from '@/data/podcastEpisodeContent';
import { Badge } from '@/components/ui/badge';

// Helper function to normalize strings (remove accents and diacritics)
const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .trim();
};

// Helper function for fuzzy matching (allows for minor typos)
const fuzzyMatch = (searchTerm: string, target: string): boolean => {
  const normalizedSearch = normalizeString(searchTerm);
  const normalizedTarget = normalizeString(target);

  // Direct inclusion
  if (normalizedTarget.includes(normalizedSearch)) return true;

  // Check if search words are in target (for multi-word searches)
  const searchWords = normalizedSearch.split(' ').filter(w => w.length > 2);
  if (searchWords.length > 0) {
    const matchedWords = searchWords.filter(word => normalizedTarget.includes(word));
    // Match if at least 50% of words are found
    return matchedWords.length >= Math.ceil(searchWords.length * 0.5);
  }

  return false;
};

const Search = () => {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return { books: [], podcasts: [], videos: [] };
    }

    const searchTerm = query.toLowerCase();
    const normalizedSearch = normalizeString(searchTerm);

    const localizedBooks = books.map((book) => localizeBook(book, t));

    // Search books with fuzzy matching
    const matchedBooks = localizedBooks.filter(book =>
      fuzzyMatch(searchTerm, book.title) ||
      fuzzyMatch(searchTerm, book.subtitle) ||
      book.description.some(desc => fuzzyMatch(searchTerm, desc)) ||
      book.keywords.some(keyword => fuzzyMatch(searchTerm, keyword)) ||
      fuzzyMatch(searchTerm, book.excerpt) ||
      normalizedSearch.includes('libro') ||
      normalizedSearch.includes('book')
    );

    // Search podcasts - include all if searching for "podcast" term
    const matchedPodcasts = normalizedSearch.includes('podcast') ||
                           normalizedSearch.includes('audio') ||
                           normalizedSearch.includes('episodio') ||
                           normalizedSearch.includes('episode')
      ? podcasts
      : podcasts.filter(podcast => {
          const title = t(podcast.titleKey);
          const description = t(podcast.descriptionKey);
          const category = t(podcast.categoryKey);
          return fuzzyMatch(searchTerm, title) ||
                 fuzzyMatch(searchTerm, description) ||
                 fuzzyMatch(searchTerm, category);
        });

    // Search videos - include all if searching for "video" term
    const matchedVideos = normalizedSearch.includes('video') ||
                         normalizedSearch.includes('youtube')
      ? videos
      : videos.filter(video => {
          const title = t(video.titleKey);
          const description = t(video.descriptionKey);
          const category = t(video.categoryKey);
          return fuzzyMatch(searchTerm, title) ||
                 fuzzyMatch(searchTerm, description) ||
                 fuzzyMatch(searchTerm, category);
        });

    return {
      books: matchedBooks,
      podcasts: matchedPodcasts,
      videos: matchedVideos
    };
  }, [query, t]);

  useEffect(() => {
    if (!query.trim()) return;
    // Track search event
    (window as any).dataLayer?.push({
      event: 'search_performed',
      search_term: query,
      results_count: searchResults.books.length + searchResults.podcasts.length + searchResults.videos.length
    });
  }, [query, searchResults.books.length, searchResults.podcasts.length, searchResults.videos.length]);

  const totalResults = searchResults.books.length + searchResults.podcasts.length + searchResults.videos.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-navy-dark via-navy to-navy-light text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 to-transparent"></div>
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[8%] w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[60%] right-[10%] w-40 h-40 bg-primary/15 rounded-full blur-3xl"></div>
          <SearchIcon className="absolute top-[20%] right-[20%] w-16 h-16 text-gold/20" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight">
              {language === 'es' ? 'Resultados de búsqueda' : 'Search Results'}
            </h1>
            {query && (
              <p className="text-xl md:text-2xl text-white/85 leading-relaxed mb-4">
                {language === 'es' ? 'Buscando por: ' : 'Searching for: '}
                <span className="text-gold font-medium">"{query}"</span>
              </p>
            )}
            <p className="text-lg text-white/70">
              {totalResults} {language === 'es' ? 'resultado(s) encontrado(s)' : 'result(s) found'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 bg-gradient-to-br from-white via-cream-light/30 to-white">
        <div className="container mx-auto px-6">
          {!query.trim() ? (
            <div className="text-center py-20">
              <SearchIcon className="w-20 h-20 mx-auto text-navy/20 mb-6" />
              <h2 className="font-heading text-3xl text-navy-dark mb-4">
                {language === 'es' ? 'Ingresa un término de búsqueda' : 'Enter a search term'}
              </h2>
              <p className="text-navy-light text-lg">
                {language === 'es'
                  ? 'Usa la barra de búsqueda arriba para encontrar libros, podcasts y videos.'
                  : 'Use the search bar above to find books, podcasts, and videos.'}
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-20">
              <SearchIcon className="w-20 h-20 mx-auto text-navy/20 mb-6" />
              <h2 className="font-heading text-3xl text-navy-dark mb-4">
                {language === 'es' ? 'No se encontraron resultados' : 'No results found'}
              </h2>
              <p className="text-navy-light text-lg">
                {language === 'es'
                  ? 'Intenta con otros términos de búsqueda.'
                  : 'Try different search terms.'}
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-16"
            >
              {/* Books Results */}
              {searchResults.books.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-8">
                    <BookOpen className="w-8 h-8 text-gold" />
                    <h2 className="font-heading text-3xl font-light text-navy-dark">
                      {language === 'es' ? 'Libros' : 'Books'} ({searchResults.books.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {searchResults.books.map((book) => (
                      <Link
                        key={book.id}
                        href={`/libros/${book.id}`}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="flex flex-col sm:flex-row h-full">
                          <div className="sm:w-1/3 h-48 sm:h-auto relative">
                            <img
                              src={book.image}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="sm:w-2/3 p-6 flex flex-col">
                            <h3 className="font-heading text-xl font-medium text-navy-dark mb-2 group-hover:text-gold transition-colors">
                              {book.title}
                            </h3>
                            <p className="text-navy-light text-sm mb-4 line-clamp-3 flex-grow">
                              {book.excerpt}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {book.keywords.slice(0, 3).map((keyword, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Podcasts Results */}
              {searchResults.podcasts.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-8">
                    <Headphones className="w-8 h-8 text-gold" />
                    <h2 className="font-heading text-3xl font-light text-navy-dark">
                      {language === 'es' ? 'Podcasts' : 'Podcasts'} ({searchResults.podcasts.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.podcasts.map((podcast) => {
                      const suppliedContent = language === 'es'
                        ? getPodcastEpisodeContent(podcast.audioUrl)
                        : undefined;
                      const podcastTitle = suppliedContent?.title ?? t(podcast.titleKey);
                      const podcastDescription = suppliedContent?.description ?? t(podcast.descriptionKey);

                      return (
                      <Link
                        key={podcast.id}
                        href={`/medios/${podcast.seriesId}/${podcast.slug}`}
                        className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="aspect-video relative overflow-hidden">
                            <img
                              src={podcast.imageUrl}
                              alt={podcastTitle}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <div className="p-5">
                          <Badge className="mb-3 text-xs">{t(podcast.categoryKey)}</Badge>
                          <h3 className="font-heading text-lg font-medium text-navy-dark mb-2 group-hover:text-gold transition-colors line-clamp-2">
                            {podcastTitle}
                          </h3>
                          <p className="text-navy-light text-sm mb-3 line-clamp-2">
                            {podcastDescription}
                          </p>
                          <div className="flex items-center justify-between text-xs text-navy-light">
                            <span>{podcast.duration}</span>
                            <span>{new Date(podcast.date).toLocaleDateString(language)}</span>
                          </div>
                        </div>
                      </Link>
                    );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Videos Results */}
              {searchResults.videos.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center gap-3 mb-8">
                    <Video className="w-8 h-8 text-gold" />
                    <h2 className="font-heading text-3xl font-light text-navy-dark">
                      {language === 'es' ? 'Videos' : 'Videos'} ({searchResults.videos.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.videos.map((video) => (
                      <Link
                        key={video.id}
                        href={`/video/${video.id}`}
                        className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <img
                            src={video.imageUrl}
                            alt={t(video.titleKey)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5">
                          <Badge className="mb-3 text-xs">{t(video.categoryKey)}</Badge>
                          <h3 className="font-heading text-lg font-medium text-navy-dark mb-2 group-hover:text-gold transition-colors line-clamp-2">
                            {t(video.titleKey)}
                          </h3>
                          <p className="text-navy-light text-sm mb-3 line-clamp-2">
                            {t(video.descriptionKey)}
                          </p>
                          <div className="flex items-center justify-between text-xs text-navy-light">
                            <span>{video.duration}</span>
                            <span>{new Date(video.date).toLocaleDateString(language)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <Search />
    </Suspense>
  );
}
